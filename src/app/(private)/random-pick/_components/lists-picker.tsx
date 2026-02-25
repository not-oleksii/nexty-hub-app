'use client';

import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ListsTabsLayout } from '@/components/common/list/lists-tabs-layout';
import { Caption } from '@/components/typography/caption';
import { Subtitle } from '@/components/typography/subtitle';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { getUniqueCandidates, splitLists, toggleSetMember } from '../helpers';
import { ListCard, ListCardSkeleton } from './list-card';
import type { SpinCandidate } from './types';

interface ListsPickerProps {
  onPoolChange: (candidates: SpinCandidate[]) => void;
}

export function ListsPicker({ onPoolChange }: ListsPickerProps) {
  const myLists = useQuery(listsQueries.all());
  const savedLists = useQuery(listsQueries.saved());
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(
    new Set(),
  );

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
      const next = toggleSetMember(selectedListIds, listId);
      setSelectedListIds(next);
      const candidates: SpinCandidate[] = allNonEmpty
        .filter((list) => next.has(list.id))
        .flatMap((list) =>
          list.discoverItems.map((item) => ({
            id: item.id,
            name: item.title,
            image: item.imageUrl ?? null,
            type: item.type,
          })),
        );
      onPoolChange(getUniqueCandidates(candidates));
    },
    [allNonEmpty, onPoolChange, selectedListIds],
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
              selected={selectedListIds.has(list.id)}
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
                selected={selectedListIds.has(list.id)}
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
