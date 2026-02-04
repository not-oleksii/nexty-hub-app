import Link from 'next/link';

import { ItemStatus } from '@prisma/client';

import { Subtitle2 } from '@/components/typography/subtitle2';
import { AlbumImage } from '@/components/ui/album-image';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { DiscoverItemDto } from '@/server/api/discover';
import { mapPrismaToItemType } from '@/server/lib/utils';

type DiscoverItemProps = {
  item: DiscoverItemDto;
};

export function DiscoverItem({ item }: DiscoverItemProps) {
  const { title, imageUrl, status } = item;

  return (
    <Link
      href={`${ROUTES.discoverList.item.replace(':type', mapPrismaToItemType(item.type)).replace(':id', item.id)}`}
    >
      <Card className="max-w-xs">
        <CardHeader>
          <div className="flex justify-between">
            <Badge variant={status === ItemStatus.DONE ? 'default' : 'outline'}>
              {status === ItemStatus.DONE ? 'DONE' : 'ADD TO LIST'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AlbumImage src={imageUrl} title={title} aspectRatio="aspect-10/16" />
        </CardContent>
        <CardFooter>
          <Subtitle2>{item.title}</Subtitle2>
        </CardFooter>
      </Card>
    </Link>
  );
}
