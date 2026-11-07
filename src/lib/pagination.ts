/** Shared by server prefetches and client infinite queries. */
export const getNextPageParam = (lastPage: {
  docs: unknown[];
  nextPage?: number | null;
}) => (lastPage.docs.length > 0 ? lastPage.nextPage : undefined);
