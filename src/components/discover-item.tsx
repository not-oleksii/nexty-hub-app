import Link from 'next/link';

import { DiscoverItemType } from '@generated/prisma/enums';
import { ListIcon, StarIcon } from 'lucide-react';

import { AddToListButton } from '@/components/add-to-list-button';
import { Caption } from '@/components/typography/caption';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import type { DiscoverItemDto } from '@/server/api/discover';
import { mapPrismaToItemType } from '@/server/utils/prisma-maps';

export type DiscoverItemDisplay = Pick<
  DiscoverItemDto,
  'id' | 'type' | 'title' | 'imageUrl' | 'category'
> & {
  rating?: number | null;
  userListsCount?: number | null;
};

type DiscoverItemProps = {
  discoverItem: DiscoverItemDisplay;
  isLoading?: boolean;
  from?: string;
};

export function DiscoverItem({
  discoverItem,
  isLoading,
  from,
}: DiscoverItemProps) {
  const { title, imageUrl, type, category, rating, userListsCount } =
    discoverItem;

  if (isLoading) {
    return <DiscoverItemSkeleton />;
  }

  const itemType = mapPrismaToItemType(discoverItem.type as DiscoverItemType);
  const baseHref = ROUTES.discover.item(itemType, discoverItem.id);
  const href = from ? `${baseHref}?from=${encodeURIComponent(from)}` : baseHref;

  return (
    <Link href={href} className="block h-full">
      <Card
        variant="interactive"
        className="group bg-card/40 flex h-full flex-col overflow-hidden pt-0 backdrop-blur-md"
      >
        <div className="relative shrink-0">
          <DynamicCover
            title={title}
            src={imageUrl}
            aspectRatio="aspect-[2/3]"
            className="w-full"
            strictHosts
            actions={
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <AddToListButton discoverItemId={discoverItem.id} iconOnly />
              </div>
            }
          />
        </div>

        <CardHeader className="px-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="hover:text-primary line-clamp-2 text-lg transition-colors">
                {title}
              </CardTitle>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {rating != null && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <StarIcon className="h-3.5 w-3.5 opacity-70" />
                  <Caption size="xs" className="font-medium">
                    {rating}
                  </Caption>
                </div>
              )}
              {userListsCount != null && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <ListIcon className="h-3.5 w-3.5 opacity-70" />
                  <Caption size="xs" className="font-medium">
                    {userListsCount}
                  </Caption>
                </div>
              )}
            </div>
          </div>
          {(type || category) && (
            <Caption size="xs" className="text-muted-foreground mt-1">
              {[type, category].filter(Boolean).join(' • ')}
            </Caption>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}

export function DiscoverItemSkeleton() {
  return (
    <Card className="bg-card/40 flex h-full flex-col overflow-hidden pt-0 backdrop-blur-md">
      <Skeleton className="aspect-[2/3] w-full shrink-0" />
      <CardHeader className="px-5 pt-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 flex-1" />
          <div className="flex shrink-0 gap-2">
            <Skeleton className="h-3.5 w-8" />
            <Skeleton className="h-3.5 w-8" />
          </div>
        </div>
        <Skeleton className="mt-2 h-3 w-1/2" />
      </CardHeader>
    </Card>
  );
}
