'use client';

import { DiscoverItemType } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/typography/header';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import { DiscoverItem, DiscoverItemSkeleton } from './discover-item';

type DiscoverItemsGridProps = {
  type: DiscoverItemType;
};

export function DiscoverItemsGrid({ type }: DiscoverItemsGridProps) {
  const { data, isLoading, isError } = useQuery(discoverQueries.type(type));

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <DiscoverItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {isError && <Header size="lg">Error loading items</Header>}
      {data?.map((item) => (
        <DiscoverItem key={item.id} discoverItem={item} isLoading={isLoading} />
      ))}
    </div>
  );
}
