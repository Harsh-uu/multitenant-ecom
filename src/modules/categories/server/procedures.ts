import { unstable_cache } from "next/cache";
import type { Payload } from "payload";

import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const CATEGORIES_CACHE_TAG = "categories";

const fetchCategories = async (db: Payload) => {
  const data = await db.find({
    collection: "categories",
    depth: 1, // Populate subcategories, subcategories.[0] will be a type of "Category"
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  return data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Because of "depth: 1" we are confident "doc" will be a type of "Category"
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));
};

export const categoriesRouter = createTRPCRouter({
  // Categories render on every storefront page but rarely change, so cache
  // them across requests. The Categories collection revalidates this tag on
  // every change, and the TTL is a fallback.
  getMany: baseProcedure.query(({ ctx }) =>
    unstable_cache(() => fetchCategories(ctx.db), ["categories:getMany"], {
      tags: [CATEGORIES_CACHE_TAG],
      revalidate: 3600,
    })()
  ),
});
