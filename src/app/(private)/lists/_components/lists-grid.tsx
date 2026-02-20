'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { CreateListCard } from './create-list-card';
import { ListCard } from './list-card';

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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CreateListCard />

      {data?.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}

export function ListsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col overflow-hidden">
          <Skeleton className="aspect-[16/9] w-full shrink-0" />
          <CardHeader className="pb-3">
            <div className="flex justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            </div>
          </CardHeader>
          <div className="flex flex-1 flex-col gap-3 px-6 pb-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12 rounded" />
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-10 rounded" />
            </div>
            <div className="mt-auto flex gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <CardFooter className="bg-muted/5 flex flex-col gap-3 border-t px-6 py-4">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
