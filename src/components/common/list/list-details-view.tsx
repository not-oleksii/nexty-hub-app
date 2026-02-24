'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from 'lucide-react';

import {
  DiscoverItem,
  DiscoverItemSkeleton,
} from '@/components/common/discover/discover-item';
import {
  ListDetailsHeader,
  ListDetailsHeaderSkeleton,
} from '@/components/common/list/list-details-header';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import type { UserListViewDto } from '@/server/api/lists';

type ListDetailsViewProps = {
  list: UserListViewDto;
};

export function ListDetailsView({ list }: ListDetailsViewProps) {
  const discoverItems = list.discoverItems ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={ROUTES.lists.root}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to lists
        </Link>
      </div>

      <ListDetailsHeader list={list} />

      <section>
        <Header size="lg" className="mb-4">
          Discover Items
        </Header>
        {discoverItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {discoverItems.map((item) => (
              <DiscoverItem
                key={item.id}
                discoverItem={item}
                from={ROUTES.lists.detail(list.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-xl border py-12">
            <Caption size="base" className="text-muted-foreground">
              No items in this list yet
            </Caption>
            <Link href={ROUTES.discover.root}>
              <Caption
                size="sm"
                className="text-primary mt-1 underline-offset-4 hover:underline"
              >
                Explore discover items!
              </Caption>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

const DISCOVER_ITEMS_SKELETON_COUNT = 8;

export function ListDetailsViewSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Skeleton className="mb-4 h-5 w-32" />
      </div>

      <ListDetailsHeaderSkeleton />

      <section>
        <Skeleton className="mb-4 h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: DISCOVER_ITEMS_SKELETON_COUNT }).map((_, i) => (
            <DiscoverItemSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
