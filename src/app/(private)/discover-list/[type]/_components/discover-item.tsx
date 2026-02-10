import Link from 'next/link';

import { type DiscoverItem } from '@generated/prisma/browser';

import { AddToListButton } from '@/components/add-to-list-button';
import { Subtitle2 } from '@/components/typography/subtitle2';
import { AlbumImage } from '@/components/ui/album-image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { mapPrismaToItemType } from '@/server/utils/prisma-maps';

type DiscoverItemProps = {
  item: DiscoverItem;
  isLoading: boolean;
};

export function DiscoverItem({ item, isLoading }: DiscoverItemProps) {
  const { title, imageUrl } = item;

  if (isLoading) {
    return <DiscoverItemSkeleton />;
  }

  return (
    <Card className="max-w-xs">
      <CardHeader>
        <div className="flex justify-between">
          <AddToListButton itemId={item.id} />
        </div>
      </CardHeader>
      <Link
        href={`${ROUTES.discoverList.item.replace(':type', mapPrismaToItemType(item.type)).replace(':id', item.id)}`}
        className="block"
      >
        <CardContent>
          <AlbumImage src={imageUrl} title={title} aspectRatio="aspect-10/16" />
        </CardContent>
        <CardFooter>
          <Subtitle2>{item.title}</Subtitle2>
        </CardFooter>
      </Link>
    </Card>
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
