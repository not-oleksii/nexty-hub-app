'use client';

import { DiscoverItemType } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  FolderIcon,
  ListIcon,
  StarIcon,
} from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Label } from '@/components/typography/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/common';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import { ItemCardActions } from './item-card-actions';

type DiscoverItemDetailsProps = {
  type: DiscoverItemType;
  id: string;
};

export function DiscoverItemDetails({ type, id }: DiscoverItemDetailsProps) {
  const { data, isLoading } = useQuery(discoverQueries.detail(type, id));

  if (isLoading) {
    return <DiscoverItemDetailsSkeleton />;
  }

  const isCompleted = Boolean(data?.isCompleted);

  return (
    <Card className="border-border/50 bg-card/40 flex flex-col overflow-hidden py-0 backdrop-blur-md md:flex-row">
      <div className="relative w-full shrink-0 md:w-72">
        <DynamicCover
          title={data?.title ?? ''}
          src={data?.imageUrl}
          aspectRatio="aspect-[2/1] md:aspect-[2/3]"
          fallbackVariant="initials"
          strictHosts
          className="h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-col gap-3">
          <Header size="xl" className="font-bold tracking-tight">
            {data?.title}
          </Header>

          <div className="flex flex-wrap items-center gap-3">
            {data?.category && (
              <Badge
                variant="secondary"
                className="bg-muted/50 text-foreground/80 hover:bg-muted/80"
              >
                <FolderIcon className="mr-1.5 h-3 w-3 opacity-70" />
                {data.category}
              </Badge>
            )}

            {data?.rating && (
              <Caption className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <StarIcon className="h-4 w-4 fill-yellow-500/20 text-yellow-500" />
                {data.rating}
              </Caption>
            )}

            {data?.userListsCount != null && (
              <Caption className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <ListIcon className="h-4 w-4 opacity-70" />
                {data.userListsCount} lists
              </Caption>
            )}
          </div>
        </div>

        <div className="border-border/10 mt-6 flex flex-wrap items-center gap-4 border-b pb-6">
          <ItemCardActions discoverItemId={id} />

          <Badge
            variant="outline"
            className={cn(
              'gap-2 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-colors',
              isCompleted
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                : 'text-muted-foreground border-white/10 bg-white/5',
            )}
          >
            {isCompleted ? (
              <CheckCircle2Icon className="h-4 w-4" />
            ) : (
              <CircleDashedIcon className="h-4 w-4 opacity-70" />
            )}
            {isCompleted ? 'Completed' : 'Todo'}
          </Badge>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            About
          </Label>
          {data?.description ? (
            <Body className="text-foreground/80 max-w-3xl leading-relaxed">
              {data.description}
            </Body>
          ) : (
            <Body className="text-muted-foreground/50 leading-relaxed italic">
              No description available.
            </Body>
          )}
        </div>
      </div>
    </Card>
  );
}

export function DiscoverItemDetailsSkeleton() {
  return (
    <Card className="border-border/50 bg-card/40 flex flex-col overflow-hidden py-0 backdrop-blur-md md:flex-row">
      <div className="w-full shrink-0 md:w-72">
        <Skeleton className="aspect-[2/1] w-full md:aspect-[2/3]" />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <Skeleton className="h-10 w-3/4" />

        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>

        <div className="border-border/10 mt-6 flex gap-4 border-b pb-6">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-5/6 max-w-2xl" />
            <Skeleton className="h-4 w-4/6 max-w-2xl" />
          </div>
        </div>
      </div>
    </Card>
  );
}
