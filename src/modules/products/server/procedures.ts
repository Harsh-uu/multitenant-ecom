import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import type { Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";
import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";
import { getReviewSummaries } from "@/modules/reviews/server/summaries";
import { getPayload } from "payload";
import config from "@payload-config";
import { cachedCatalogQuery } from "@/lib/cache";

const getProductsInput = z.object({
  cursor: z.number().default(1),
  limit: z.number().default(DEFAULT_LIMIT),
  search: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  minPrice: z.string().nullable().optional(),
  maxPrice: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  sort: z
    .enum(sortValues as [string, ...string[]])
    .nullable()
    .optional(),
  tenantSlug: z.string().nullable().optional(),
});

/** Product listings (home, categories, stores); identical for every visitor. */
const getProducts = cachedCatalogQuery(
  "products:getMany",
  async (input: z.infer<typeof getProductsInput>) => {
    const db = await getPayload({ config });
    const where: Where = {
      isArchived: {
        not_equals: true,
      },
    };
    let sort: Sort = "-createdAt";

    if (input.sort === "curated") {
      sort = "-createdAt";
    }
    if (input.sort === "hot_and_new") {
      sort = "+createdAt";
    }
    if (input.sort === "trending") {
      sort = "-createdAt";
    }

    if (input.minPrice && input.maxPrice) {
      where.price = {
        greater_than_equal: input.minPrice,
        less_than_equal: input.maxPrice,
      };
    } else if (input.minPrice) {
      where.price = {
        greater_than_equal: input.minPrice,
      };
    } else if (input.maxPrice) {
      where.price = {
        less_than_equal: input.maxPrice,
      };
    }

    if (input.tenantSlug) {
      where["tenant.slug"] = {
        equals: input.tenantSlug,
      };
    } else {
      where["isPrivate"] = {
        not_equals: true,
      };
    }

    if (input.category) {
      const categoriesData = await db.find({
        collection: "categories",
        limit: 1,
        depth: 1, // Populate subcategories, subcategories.[0] will be a type of "Category"
        pagination: false,
        select: { slug: true, subcategories: true },
        where: {
          slug: {
            equals: input.category,
          },
        },
      });

      const formattedData = categoriesData.docs.map((doc) => ({
        ...doc,
        subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
          // Becasue of "depth: 1" we are confident "doc" will be a type of "Category"
          ...(doc as Category),
        })),
      }));

      const subcategoriesSlugs = [];
      const parentCategory = formattedData[0];

      if (parentCategory) {
        subcategoriesSlugs.push(
          ...parentCategory.subcategories.map(
            (subcategory) => subcategory.slug,
          ),
        );
        where["category.slug"] = {
          in: [parentCategory.slug, ...subcategoriesSlugs],
        };
      }
    }

    if (input.tags && input.tags.length > 0) {
      where["tags.name"] = {
        in: input.tags,
      };
    }

    if (input.search) {
      where["name"] = {
        like: input.search,
      };
    }

    const data = await db.find({
      collection: "products",
      depth: 2, // Populate "image" and "tenant.image"
      where,
      sort,
      page: input.cursor,
      limit: input.limit,
      // Only what product cards render
      select: {
        name: true,
        price: true,
        image: true,
        tenant: true,
      },
      populate: {
        tenants: { name: true, slug: true, image: true },
      },
    });

    const summaries = await getReviewSummaries(
      db,
      data.docs.map((doc) => doc.id),
    );

    const dataWithSummarizedReviews = data.docs.map((doc) => ({
      ...doc,
      ...summaries.get(doc.id)!,
    }));

    return {
      ...data,
      docs: dataWithSummarizedReviews.map((doc) => ({
        ...doc,
        image: doc.image as Media | null,
        tenant: doc.tenant as Tenant & { image: Media | null },
      })),
    };
  },
);

/** Public product details plus review stats; shared by every visitor. */
const getPublicProduct = cachedCatalogQuery(
  "products:getOne",
  async (id: string) => {
    const db = await getPayload({ config });
    const [product, reviews] = await Promise.all([
      db.findByID({
        collection: "products",
        id,
        depth: 2,
        // Paid content stays out of the public cache.
        select: { content: false },
        populate: { tenants: { name: true, slug: true, image: true } },
        disableErrors: true,
      }),
      db.find({
        collection: "reviews",
        depth: 0,
        pagination: false,
        select: { rating: true },
        where: { product: { equals: id } },
      }),
    ]);

    if (!product || product.isArchived) return null;

    const reviewCount = reviews.totalDocs;
    const reviewRating =
      reviewCount > 0
        ? Math.round(
            (reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
              reviewCount) *
              10,
          ) / 10
        : 0;

    const ratingDistribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    for (const { rating } of reviews.docs) {
      if (rating >= 1 && rating <= 5) ratingDistribution[rating]! += 1;
    }
    if (reviewCount > 0) {
      for (const key of Object.keys(ratingDistribution)) {
        const rating = Number(key);
        ratingDistribution[rating] = Math.round(
          (ratingDistribution[rating]! / reviewCount) * 100,
        );
      }
    }

    return {
      ...product,
      image: product.image as Media | null,
      tenant: product.tenant as Tenant & { image: Media | null },
      reviewRating,
      reviewCount,
      ratingDistribution,
    };
  },
);

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const [session, product] = await Promise.all([
        ctx.db.auth({ headers }),
        getPublicProduct(input.id),
      ]);

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Per-user, so never cached.
      const purchases = session.user
        ? await ctx.db.count({
            collection: "orders",
            where: {
              and: [
                { product: { equals: input.id } },
                { user: { equals: session.user.id } },
              ],
            },
          })
        : null;

      return { ...product, isPurchased: (purchases?.totalDocs ?? 0) > 0 };
    }),
  getMany: baseProcedure
    .input(getProductsInput)
    .query(({ input }) => getProducts(input)),
});
