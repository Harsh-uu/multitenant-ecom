import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        // Only finished queries. Pages await their prefetches; sending pending
        // ones let a layout (which renders in parallel with the page) ship a
        // pending copy of the page's query, making the client suspend and
        // stream content that was already rendered on the server.
        shouldDehydrateQuery: defaultShouldDehydrateQuery,
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}