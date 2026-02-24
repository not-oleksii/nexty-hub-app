'use client';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import { ListCard, ListCardSkeleton } from '@/components/common/list/list-card';
import { Caption } from '@/components/typography/caption';
import { ROUTES } from '@/constants/routes';
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
    return (
      <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-xl border py-12">
        <Caption size="base" className="text-muted-foreground">
          No saved lists yet
        </Caption>
        <Caption size="sm" className="text-muted-foreground mt-1">
          Save public lists from the Discover page to find them here.
        </Caption>
        <Link href={ROUTES.discover.root}>
          <Caption
            size="sm"
            className="text-primary mt-1 underline-offset-4 hover:underline"
          >
            Explore user-created lists!
          </Caption>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}

function SavedListsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <ListCardSkeleton key={index} />
      ))}
    </div>
  );
}
