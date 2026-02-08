import { ItemType } from '@generated/prisma/enums';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { SparkleIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Header1 } from '@/components/typography/header1';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import { DiscoverListCard } from './_components/discover-list-card';

const types: ItemType[] = [
  ItemType.MOVIE,
  ItemType.SERIES,
  ItemType.GAME,
  ItemType.BOOK,
  ItemType.COURSE,
  ItemType.OTHER,
] as const;

export default async function DiscoverListPage() {
  const queryClient = new QueryClient();

  await Promise.all(
    types.map((type) => queryClient.prefetchQuery(discoverQueries.type(type))),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper>
        <div className="flex items-center gap-2">
          <Header1>Discover your next adventure</Header1>
          <SparkleIcon className="text-primary" fill="currentColor" />
        </div>

        <div className="3xl:grid-cols-4 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <DiscoverListCard type={ItemType.MOVIE} />
          <DiscoverListCard type={ItemType.SERIES} />
          <DiscoverListCard type={ItemType.GAME} />
          <DiscoverListCard type={ItemType.BOOK} />
          <DiscoverListCard type={ItemType.COURSE} />
          <DiscoverListCard type={ItemType.OTHER} />
        </div>
      </ContentWrapper>
    </HydrationBoundary>
  );
}
