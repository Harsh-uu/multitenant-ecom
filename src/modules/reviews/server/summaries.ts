import "server-only";
import type { Payload } from "payload";

export type ReviewSummary = {
  reviewCount: number;
  reviewRating: number;
};

/**
 * Fetches review counts and average ratings for many products with a single
 * query (instead of one query per product).
 */
export async function getReviewSummaries(
  db: Payload,
  productIds: string[]
): Promise<Map<string, ReviewSummary>> {
  const summaries = new Map<string, ReviewSummary>();
  if (productIds.length === 0) return summaries;

  const reviews = await db.find({
    collection: "reviews",
    depth: 0,
    pagination: false,
    where: { product: { in: productIds } },
    select: { rating: true, product: true },
  });

  const totals = new Map<string, { sum: number; count: number }>();
  for (const review of reviews.docs) {
    const productId =
      typeof review.product === "string" ? review.product : review.product.id;
    const entry = totals.get(productId) ?? { sum: 0, count: 0 };
    entry.sum += review.rating;
    entry.count += 1;
    totals.set(productId, entry);
  }

  for (const id of productIds) {
    const entry = totals.get(id);
    summaries.set(id, {
      reviewCount: entry?.count ?? 0,
      reviewRating: entry ? Math.round((entry.sum / entry.count) * 10) / 10 : 0,
    });
  }

  return summaries;
}
