'use client';

import { useQuery } from '@tanstack/react-query';

import { ListCard, ListCardSkeleton } from '@/components/list-card';
import { Header } from '@/components/typography/header';
import { Separator } from '@/components/ui/separator';
import { listsQueries } from '@/server/api/queries/lists.queries';

export function SavedListsGrid() {
  const { data, isLoading, isError } = useQuery(listsQueries.saved());

  if (isLoading) {
    return <SavedListsGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive flex h-32 items-center justify-center rounded-xl border">
        There was an error loading your saved lists.
      </div>
    );
  }

  if (!data?.length) {
    return null;
  }

  return (
    <>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <Header size="lg">Saved Lists</Header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </div>
    </>
  );
}

function SavedListsGridSkeleton() {
  return (
    <>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <Header size="lg">Saved Lists</Header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ListCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
