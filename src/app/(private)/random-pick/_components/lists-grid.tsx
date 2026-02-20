'use client';

import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Subtitle } from '@/components/typography/subtitle';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { ListCard, ListCardSkeleton } from './list-card';
import { Reel } from './random-reel';

interface ListsGridProps {
  onListClick: (selectedReels: Reel[]) => void;
}

export function ListsGrid({ onListClick }: ListsGridProps) {
  const { data, isLoading, isError } = useQuery(listsQueries.all());
  const [selectedListsIds, setSelectedListsIds] = useState<string[]>([]);
  const nonEmptyLists = useMemo(
    () => data?.filter((list) => list.discoverItems.length > 0),
    [data],
  );
  const emptyLists = useMemo(
    () => data?.filter((list) => list.discoverItems.length === 0),
    [data],
  );

  const handleListClick = useCallback(
    (listId: string) => {
      const selectedIds = selectedListsIds.includes(listId)
        ? selectedListsIds.filter((id) => id !== listId)
        : [...selectedListsIds, listId];

      setSelectedListsIds(selectedIds);

      const reels =
        nonEmptyLists
          ?.filter((list) => selectedIds.includes(list.id))
          .flatMap((list) => list.discoverItems) ?? [];

      onListClick(reels);
    },
    [selectedListsIds, nonEmptyLists, onListClick],
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ListCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!data?.length || isError) {
    return (
      <Subtitle size="sm">No lists found. Create one to get started!</Subtitle>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {nonEmptyLists?.map((list) => (
        <ListCard
          key={list.id}
          list={list}
          selected={selectedListsIds.includes(list.id)}
          onClick={handleListClick}
        />
      ))}
      {emptyLists?.map((list) => (
        <ListCard key={list.id} list={list} disabled />
      ))}
    </div>
  );
}
