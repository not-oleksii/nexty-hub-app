import type { QueryClient } from '@tanstack/react-query';

/**
 * Clears the entire TanStack Query cache. Call on login/logout
 * so the new user sees fresh data instead of the previous user's cached data.
 * No need to add new query keys when new queries are introduced.
 */
export function clearSessionCache(queryClient: QueryClient): void {
  queryClient.clear();
}
