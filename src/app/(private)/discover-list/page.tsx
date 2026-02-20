import { DiscoverItemType } from '@generated/prisma/enums';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { SparkleIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Header } from '@/components/typography/header';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import { DiscoverListCard } from './_components/discover-list-card';

const types: DiscoverItemType[] = [
  DiscoverItemType.MOVIE,
  DiscoverItemType.SERIES,
  DiscoverItemType.GAME,
  DiscoverItemType.BOOK,
  DiscoverItemType.COURSE,
  DiscoverItemType.OTHER,
];

export default async function DiscoverListPage() {
  const queryClient = new QueryClient();

  await Promise.all(
    types.map((type) => queryClient.prefetchQuery(discoverQueries.type(type))),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper>
        <div className="flex items-center gap-2">
          <Header>Discover your next adventure</Header>
          <SparkleIcon className="text-primary" fill="currentColor" />
        </div>

        <div className="3xl:grid-cols-4 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <DiscoverListCard type={DiscoverItemType.MOVIE} />
          <DiscoverListCard type={DiscoverItemType.SERIES} />
          <DiscoverListCard type={DiscoverItemType.GAME} />
          <DiscoverListCard type={DiscoverItemType.BOOK} />
          <DiscoverListCard type={DiscoverItemType.COURSE} />
          <DiscoverListCard type={DiscoverItemType.OTHER} />
        </div>
      </ContentWrapper>
    </HydrationBoundary>
  );
}
