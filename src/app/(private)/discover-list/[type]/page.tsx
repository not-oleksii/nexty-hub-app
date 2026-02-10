import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { ContentWrapper } from '@/components/layout/content';
import { Header1 } from '@/components/typography/header1';
import { discoverQueries } from '@/server/api/queries/discover.queries';
import { mapItemTypeToPrisma } from '@/server/utils/prisma-maps';

import { DiscoverItemsGrid } from './_components/discover-items-grid';
import { DiscoverListPageProps } from './types';

export default async function DiscoverMoviesPage({
  params,
}: DiscoverListPageProps) {
  const { type } = await params;
  const queryClient = new QueryClient();
  const prismaType = mapItemTypeToPrisma(type);
  await queryClient.prefetchQuery(discoverQueries.type(prismaType));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper>
        <Header1>{type.toUpperCase()}</Header1>
        <DiscoverItemsGrid type={prismaType} />
      </ContentWrapper>
    </HydrationBoundary>
  );
}
