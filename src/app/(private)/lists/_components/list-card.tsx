'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

import { ListVisibility } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, EyeIcon } from 'lucide-react';

import { ItemsProgress } from '@/components/items-progress';
import { ListEditButton } from '@/components/list-edit-button';
import { ListMembersBadges } from '@/components/list-members-badges';
import { ListTagsBadges } from '@/components/list-tags-badges';
import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Label } from '@/components/typography/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ListCover } from '@/components/ui/list-cover';
import { Skeleton } from '@/components/ui/skeleton';
import { LIST_VISIBILITY_LABELS } from '@/constants/list-visibility';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/utils/format-date';
import type { UserListSummaryDto } from '@/server/api/lists';
import { usersQueries } from '@/server/api/queries/users.queries';

const DESCRIPTION_MAX_LENGTH = 80;

type ListCardProps = {
  list: UserListSummaryDto;
};

export function ListCard({ list }: ListCardProps) {
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
  const VisibilityIcon = visibility.icon;

  const shortDescription = list.description
    ? list.description.length > DESCRIPTION_MAX_LENGTH
      ? `${list.description.slice(0, DESCRIPTION_MAX_LENGTH).trim()}…`
      : list.description
    : null;

  const hoverContent = (
    <div className="flex max-w-56 flex-col gap-1">
      <Body className="leading-tight font-medium break-words" size="sm">
        {list.name}
      </Body>
      {shortDescription && (
        <Caption size="xs" className="leading-relaxed font-normal break-words">
          {shortDescription}
        </Caption>
      )}
    </div>
  );

  return (
    <Card
      variant="interactive"
      className="group relative flex h-full flex-col overflow-hidden pt-0"
    >
      <Link
        href={ROUTES.lists.detail(list.id)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="relative shrink-0">
          <ListCover
            coverImageUrl={list.coverImageUrl}
            listName={list.name}
            discoverItems={list.discoverItems}
            className="w-full"
          />
        </div>

        <CardHeader className="px-5 pt-4 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <CardTitle className="hover:text-primary line-clamp-1 cursor-pointer text-lg transition-colors">
                    {list.name}
                  </CardTitle>
                </HoverCardTrigger>
                <HoverCardContent
                  side="top"
                  align="start"
                  className="shadow-lg"
                >
                  {hoverContent}
                </HoverCardContent>
              </HoverCard>
              <Caption className="line-clamp-1">
                By{' '}
                <Label className="text-foreground/80">
                  {list.owner.username}
                </Label>
              </Caption>
            </div>
            <Badge
              variant="outline"
              size="sm"
              className="shrink-0 backdrop-blur-sm"
            >
              <VisibilityIcon className="text-muted-foreground mr-1.5 h-3 w-3" />
              {visibility.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 px-5">
          <div className="min-h-[40px]">
            {shortDescription ? (
              <Caption
                size="base"
                className="text-muted-foreground line-clamp-2 leading-snug"
              >
                {shortDescription}
              </Caption>
            ) : (
              <Caption
                size="base"
                className="text-muted-foreground/40 line-clamp-2 leading-snug italic"
              >
                No description provided.
              </Caption>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <ListMembersBadges
              members={members}
              maxDisplay={3}
              emptyLabel="Only you"
            />
            <ListTagsBadges tags={tags} maxDisplay={3} />
          </div>

          <div className="text-muted-foreground mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
              <Caption size="xs" className="font-medium">
                Last updated:&nbsp;
                {list.updatedAt ? formatDate(list.updatedAt) : 'Recently'}
              </Caption>
            </div>
            <div className="flex items-center gap-1.5">
              <EyeIcon className="h-3.5 w-3.5 opacity-70" />
              <Caption size="xs" className="font-medium">
                {list.viewsCount ?? 0}
              </Caption>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-border/50 bg-background/40 border-t px-5 py-3 backdrop-blur-xl">
          <ItemsProgress
            value={list.completedDiscoverItems}
            maxValue={list.totalDiscoverItems}
          />
        </CardFooter>
      </Link>

      {mounted && isOwner && (
        <ListEditButton listId={list.id} variant="overlay" />
      )}
    </Card>
  );
}

export function ListCardSkeleton() {
  return (
    <Card className="group flex h-full flex-col overflow-hidden pt-0">
      <Skeleton className="aspect-[16/9] w-full shrink-0" />

      <CardHeader className="px-5 pt-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <Skeleton className="h-6 w-14 shrink-0 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-5">
        <div className="min-h-[40px] space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-border/50 bg-background/40 border-t px-5 py-3 backdrop-blur-xl">
        <div className="flex w-full flex-col gap-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
