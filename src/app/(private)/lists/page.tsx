import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { listsQueries } from '@/server/api/queries/lists.queries';

import { ListsGrid } from './_components/lists-grid';
import { SavedListsGrid } from './_components/saved-lists-grid';

export default async function ListsPage() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(listsQueries.all()),
    queryClient.prefetchQuery(listsQueries.saved()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <ListsGrid />
        <SavedListsGrid />
      </div>
    </HydrationBoundary>
  );
}
