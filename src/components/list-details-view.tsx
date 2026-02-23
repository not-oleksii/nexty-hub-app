'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from 'lucide-react';

import { DiscoverItemCard } from '@/components/discover-item-card';
import { ListDetailsHeader } from '@/components/list-details-header';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
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
              <DiscoverItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-xl border py-12">
            <Caption size="base" className="text-muted-foreground">
              No items in this list yet
            </Caption>
            <Caption size="sm" className="text-muted-foreground/70 mt-1">
              Add discover items when editing the list
            </Caption>
          </div>
        )}
      </section>
    </div>
  );
}
