import { revalidateTag, unstable_cache } from "next/cache";

/** Tag for all public storefront data (products, stores, reviews, tags). */
export const CATALOG_TAG = "catalog";

/**
 * Caches a public read in Next's data cache (shared across all serverless
 * instances). Arguments are part of the cache key. Entries are cleared by
 * revalidateCatalog() whenever catalogue data changes; the TTL is a fallback.
 */
export function cachedCatalogQuery<Args extends unknown[], Result>(
  key: string,
  fn: (...args: Args) => Promise<Result>,
  revalidate = 600
) {
  return unstable_cache(fn, [key], { tags: [CATALOG_TAG], revalidate });
}

/** Payload collection hook: drop cached catalogue data after any change. */
export const revalidateCatalog = () => {
  try {
    revalidateTag(CATALOG_TAG, { expire: 0 });
  } catch {
    // Not running inside Next.js (e.g. seed scripts); nothing to revalidate.
  }
};
