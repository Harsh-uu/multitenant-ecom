import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { DEFAULT_LIMIT } from "@/constants";
import { getPayload } from "payload";
import config from "@payload-config";
import { cachedCatalogQuery } from "@/lib/cache";

const getTags = cachedCatalogQuery(
  "tags:getMany",
  async (page: number, limit: number) => {
    const db = await getPayload({ config });
    return db.find({
      collection: "tags",
      page,
      limit,
      sort: "name",
      select: { name: true },
    });
  },
);

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(({ input }) => getTags(input.cursor, input.limit)),
});
