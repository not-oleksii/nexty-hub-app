'use client';

import { useEffect, useState } from 'react';

import { ListVisibility } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { ItemsProgress } from '@/components/items-progress';
import { ListEditButton } from '@/components/list-edit-button';
import { ListMembersBadges } from '@/components/list-members-badges';
import { ListTagsBadges } from '@/components/list-tags-badges';
import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Skeleton } from '@/components/ui/skeleton';
import { LIST_VISIBILITY_LABELS } from '@/constants/list-visibility';
import { formatDate } from '@/lib/utils/format-date';
import type { UserListViewDto } from '@/server/api/lists';
import { usersQueries } from '@/server/api/queries/users.queries';

type ListDetailsHeaderProps = {
  list: UserListViewDto;
};

export function ListDetailsHeader({ list }: ListDetailsHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { data: currentUser } = useQuery(usersQueries.current());
  const isOwner = list.owner.id === currentUser?.id;

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const tags = list.tags ?? [];
  const members = list.members ?? [];
  const visibilityKey = (list.visibility ??
    ListVisibility.PRIVATE) as ListVisibility;
  const visibility =
    LIST_VISIBILITY_LABELS[visibilityKey] ?? LIST_VISIBILITY_LABELS.PRIVATE;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-4 md:min-h-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Header size="xl">{list.name}</Header>
            <Caption size="base" className="text-muted-foreground">
              {`By ${list.owner.username}`} • {visibility.label} •{' '}
              {`Updated ${list.updatedAt ? formatDate(list.updatedAt) : 'Recently'}`}{' '}
              • {list.viewsCount ?? 0} views
            </Caption>
          </div>

          {list.description && (
            <Body className="text-muted-foreground max-w-2xl leading-relaxed">
              {list.description}
            </Body>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {members.length > 0 && (
            <ListMembersBadges
              members={members}
              size="md"
              prefix={`Shared with ${members.length} users `}
            />
          )}
          {tags.length > 0 && <ListTagsBadges tags={tags} size="md" />}
        </div>

        <div className="border-border/50 bg-background/40 rounded-lg border p-4 backdrop-blur-xl">
          <ItemsProgress
            value={list.completedDiscoverItems}
            maxValue={list.totalDiscoverItems}
          />
        </div>
      </div>

      <div className="relative shrink-0 overflow-hidden rounded-xl md:w-64 md:min-w-64">
        <DynamicCover
          title={list.name}
          src={list.coverImageUrl}
          fallbackSrcs={list.discoverItems?.map((i) => i.imageUrl)}
          aspectRatio="aspect-[3/4]"
          className="w-full"
          actions={
            mounted &&
            isOwner && (
              <ListEditButton
                listId={list.id}
                variant="static"
                className="relative"
              />
            )
          }
        />
      </div>
    </div>
  );
}

export function ListDetailsHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-4 md:min-h-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-4/5 max-w-2xl" />
            <Skeleton className="h-4 w-3/5 max-w-2xl" />
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-4 shrink-0 rounded" />
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>
        </div>

        <div className="border-border/50 bg-background/40 rounded-lg border p-4 backdrop-blur-xl">
          <div className="flex w-full flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      </div>

      <div className="relative shrink-0 overflow-hidden rounded-xl md:w-64 md:min-w-64">
        <Skeleton className="aspect-[3/4] w-full" />
      </div>
    </div>
  );
}
