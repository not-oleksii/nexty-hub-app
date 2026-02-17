'use client';

import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Subtitle3 } from '@/components/typography/subtitle3';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { ListCard, ListCardSkeleton } from './list-card';

export function ListsGrid() {
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

  const handleListClick = useCallback((listId: string) => {
    setSelectedListsIds((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId],
    );
  }, []);

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
    return <Subtitle3>No lists found. Create one to get started!</Subtitle3>;
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
