import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Media, Tenant } from "@/payload-types";
import { getPayload } from "payload";
import config from "@payload-config";
import { cachedCatalogQuery } from "@/lib/cache";

const getTenant = cachedCatalogQuery("tenants:getOne", async (slug: string) => {
  const db = await getPayload({ config });
  const tenantsData = await db.find({
    collection: "tenants",
    depth: 1, // Populate "image"
    select: { name: true, slug: true, image: true },
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
  });
  return (tenantsData.docs[0] ?? null) as
    | (Tenant & { image: Media | null })
    | null;
});

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const tenant = await getTenant(input.slug);

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      return tenant;
    }),
});
