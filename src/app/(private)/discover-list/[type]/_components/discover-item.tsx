import Link from 'next/link';

import { AddToListButton } from '@/components/add-to-list-button';
import { Subtitle } from '@/components/typography/subtitle';
import { AlbumImage } from '@/components/ui/album-image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DiscoverItemType } from '@generated/prisma/enums';
import { ROUTES } from '@/constants/routes';
import type { DiscoverItemDto } from '@/server/api/discover';
import { mapPrismaToItemType } from '@/server/utils/prisma-maps';

type DiscoverItemProps = {
  discoverItem: DiscoverItemDto;
  isLoading: boolean;
};

export function DiscoverItem({ discoverItem, isLoading }: DiscoverItemProps) {
  const { title, imageUrl } = discoverItem;

  if (isLoading) {
    return <DiscoverItemSkeleton />;
  }

  return (
    <Link
      href={`${ROUTES.discoverList.item.replace(':type', mapPrismaToItemType(discoverItem.type as DiscoverItemType)).replace(':id', discoverItem.id)}`}
      className="block"
    >
      <Card variant="interactive" className="max-w-xs">
        <CardHeader>
          <div
            className="flex justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <AddToListButton discoverItemId={discoverItem.id} />
          </div>
        </CardHeader>
        <CardContent>
          <AlbumImage src={imageUrl} title={title} aspectRatio="aspect-10/16" />
        </CardContent>
        <CardFooter>
          <Subtitle size="base">{discoverItem.title}</Subtitle>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function DiscoverItemSkeleton() {
  return (
    <Card className="max-w-xs">
      <CardHeader>
        <Skeleton className="h-10 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-70 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-5 w-30" />
      </CardFooter>
    </Card>
  );
}
