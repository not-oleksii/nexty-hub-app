import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { listsQueries } from '@/server/api/queries/lists.queries';

import { ListsGrid } from './_components/lists-grid';

export default async function ListsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(listsQueries.overview());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <ListsGrid />
      </div>
    </HydrationBoundary>
  );
}
