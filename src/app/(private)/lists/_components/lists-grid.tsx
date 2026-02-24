'use client';

import { useQuery } from '@tanstack/react-query';

import { ListCard, ListCardSkeleton } from '@/components/list-card';
import { Header } from '@/components/typography/header';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { CreateListCard } from './create-list-card';

export function ListsGrid() {
  const { data, isLoading, isError } = useQuery(listsQueries.all());

  if (isLoading) {
    return <ListsGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive flex h-32 items-center justify-center rounded-xl border">
        There was an error loading your lists.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Header size="lg">My Lists</Header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateListCard />

        {data?.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}

export function ListsGridSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Header size="lg">My Lists</Header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ListCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
