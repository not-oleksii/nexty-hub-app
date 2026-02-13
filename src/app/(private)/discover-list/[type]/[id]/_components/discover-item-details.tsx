'use client';

import { DiscoverItemType } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { Body } from '@/components/typography/body';
import { Caption1 } from '@/components/typography/caption1';
import { Title } from '@/components/typography/title';
import { AlbumImage } from '@/components/ui/album-image';
import { Badge } from '@/components/ui/badge';
import { DetailsList } from '@/components/ui/details-list';
import { Skeleton } from '@/components/ui/skeleton';
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
    <div className="flex justify-between gap-6 max-md:flex-col max-md:gap-4">
      <div className="flex max-w-sm flex-col gap-3">
        <div className="flex items-center gap-2">
          <Title>{data?.title}</Title>
          <Badge variant={isCompleted ? 'default' : 'outline'}>
            {isCompleted ? 'Completed' : 'Todo'}
          </Badge>
        </div>
        <DetailsList
          items={[
            {
              label: 'Category',
              value: data?.category ?? '-',
            },
          ]}
        />
        <div className="flex flex-col gap-1">
          <Caption1>Description</Caption1>
          <Body>{data?.description}</Body>
        </div>
        <ItemCardActions itemId={id} />
      </div>
      <div className="flex max-md:justify-center">
        <AlbumImage
          src={data?.imageUrl}
          title={data?.title ?? ''}
          className="w-3xs"
          aspectRatio="aspect-10/16"
        />
      </div>
    </div>
  );
}

export function DiscoverItemDetailsSkeleton() {
  return (
    <div className="flex justify-between gap-6 max-md:flex-col max-md:gap-4 md:h-100 md:w-170">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-15" />
        </div>
        <Skeleton className="h-3 w-full" />
        <div className="flex flex-col gap-1">
          <Caption1>Description</Caption1>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex max-md:justify-center">
        <Skeleton className="h-full w-60" />
      </div>
    </div>
  );
}
