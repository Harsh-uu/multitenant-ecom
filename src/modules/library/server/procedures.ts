import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";
import { getReviewSummaries } from "@/modules/reviews/server/summaries";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0,
        limit: 1,
        pagination: false,
        select: {},
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              }
            },
            {
              user: {
                equals: ctx.session.user.id,
              }
            },
          ]
        }
      });

      const order = ordersData.docs[0];

      if(!order){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        })
      }

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      })

      if(!product){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        })
      }

      return product;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        select: { product: true },
        where: {
          user: {
            equals: ctx.session.user.id,
          }
        }
      });

      const productIds = ordersData.docs.map((order) =>
        typeof order.product === "string" ? order.product : order.product.id
      );

      const [productsData, summaries] = await Promise.all([
        ctx.db.find({
          collection: "products",
          depth: 2, // Populate "image" and "tenant.image"
          pagination: false,
          where: {
            id: {
              in: productIds,
            },
          },
          select: { name: true, price: true, image: true, tenant: true },
          populate: {
            tenants: { name: true, slug: true, image: true },
          },
        }),
        getReviewSummaries(ctx.db, productIds),
      ]);

      const dataWithSummarizedReviews = productsData.docs.map((doc) => ({
        ...doc,
        ...summaries.get(doc.id)!,
      }));

      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
