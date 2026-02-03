import Link from 'next/link';

import { ItemStatus } from '@prisma/client';

import { ROUTES } from '@/constants/routes';
import { DiscoverItemDto } from '@/server/api/discover';
import { mapPrismaToItemType } from '@/server/lib/utils';

import { Body } from './typography/body';
import { Caption1 } from './typography/caption1';
import { Caption2 } from './typography/caption2';
import { Header2 } from './typography/header2';
import { Label } from './typography/label';
import { Overline } from './typography/overline';
import { Subtitle1 } from './typography/subtitle1';
import { Subtitle3 } from './typography/subtitle3';
import { Title } from './typography/title';
import { AlbumImage } from './ui/album-image';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { DetailsList, DetailsRow } from './ui/details-list';

type DiscoverItemProps = {
  item: DiscoverItemDto;
};

export function DiscoverItem({ item }: DiscoverItemProps) {
  const { title, category, imageUrl, description, status } = item;

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
          <Subtitle1>{item.title}</Subtitle1>
        </CardFooter>
      </Card>
    </Link>
  );
}
