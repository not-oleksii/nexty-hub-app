'use client';

import { ItemType } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { Title } from '@/components/typography/title';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import { DiscoverItem, DiscoverItemSkeleton } from './discover-item';

type DiscoverItemsGridProps = {
  type: ItemType;
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
      {isError && <Title>Error loading items</Title>}
      {data?.map((item) => (
        <DiscoverItem key={item.id} item={item} isLoading={isLoading} />
      ))}
    </div>
  );
}
