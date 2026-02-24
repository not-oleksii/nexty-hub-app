import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { listsQueries } from '@/server/api/queries/lists.queries';

import { ListsTabs } from './_components/lists-tabs';

export default async function ListsPage() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(listsQueries.all()),
    queryClient.prefetchQuery(listsQueries.saved()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListsTabs />
    </HydrationBoundary>
  );
}
