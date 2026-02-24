'use client';

import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ListsTabsLayout } from '@/components/lists-tabs-layout';
import { Caption } from '@/components/typography/caption';
import { Subtitle } from '@/components/typography/subtitle';
import type { UserListSummaryDto } from '@/server/api/lists';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { ListCard, ListCardSkeleton } from './list-card';
import { Reel } from './random-reel';

interface ListsGridProps {
  onListClick: (selectedReels: Reel[]) => void;
}

function splitLists(data: UserListSummaryDto[] | undefined) {
  const nonEmpty = data?.filter((list) => list.discoverItems.length > 0) ?? [];
  const empty = data?.filter((list) => list.discoverItems.length === 0) ?? [];

  return { nonEmpty, empty };
}

export function ListsGrid({ onListClick }: ListsGridProps) {
  const myLists = useQuery(listsQueries.all());
  const savedLists = useQuery(listsQueries.saved());
  const [selectedListsIds, setSelectedListsIds] = useState<string[]>([]);

  const myListsSplit = useMemo(() => splitLists(myLists.data), [myLists.data]);
  const savedListsSplit = useMemo(
    () => splitLists(savedLists.data),
    [savedLists.data],
  );

  const allNonEmpty = useMemo(
    () => [...myListsSplit.nonEmpty, ...savedListsSplit.nonEmpty],
    [myListsSplit.nonEmpty, savedListsSplit.nonEmpty],
  );

  const handleListClick = useCallback(
    (listId: string) => {
      const selectedIds = selectedListsIds.includes(listId)
        ? selectedListsIds.filter((id) => id !== listId)
        : [...selectedListsIds, listId];

      setSelectedListsIds(selectedIds);

      const reels =
        allNonEmpty
          .filter((list) => selectedIds.includes(list.id))
          .flatMap((list) => list.discoverItems) ?? [];

      onListClick(reels);
    },
    [selectedListsIds, allNonEmpty, onListClick],
  );

  const isLoading = myLists.isLoading || savedLists.isLoading;
  const hasSavedLists = (savedLists.data?.length ?? 0) > 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ListCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!myLists.data?.length && !savedLists.data?.length) {
    return (
      <Subtitle size="sm">No lists found. Create one to get started!</Subtitle>
    );
  }

  return (
    <ListsTabsLayout
      disableSaved={!hasSavedLists}
      contentClassName="mt-4"
      myListsContent={
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {myListsSplit.nonEmpty.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              selected={selectedListsIds.includes(list.id)}
              onClick={handleListClick}
            />
          ))}
          {myListsSplit.empty.map((list) => (
            <ListCard key={list.id} list={list} disabled />
          ))}
        </div>
      }
      savedContent={
        hasSavedLists ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {savedListsSplit.nonEmpty.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                selected={selectedListsIds.includes(list.id)}
                onClick={handleListClick}
              />
            ))}
            {savedListsSplit.empty.map((list) => (
              <ListCard key={list.id} list={list} disabled />
            ))}
          </div>
        ) : (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-xl border py-12">
            <Caption size="base" className="text-muted-foreground">
              No saved lists yet
            </Caption>
          </div>
        )
      }
    />
  );
}
