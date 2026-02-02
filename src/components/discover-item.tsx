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
      <Card className="md:min-w-sm">
        <CardHeader>
          <div className="flex justify-between">
            <Header2>{item.title}</Header2>
            <Badge variant={status === ItemStatus.DONE ? 'default' : 'outline'}>
              {status === ItemStatus.DONE ? 'DONE' : 'ADD TO LIST'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-l flex justify-between gap-2">
            <div className="w-1/2">
              <DetailsList
                items={[{ label: 'Category', value: category ?? '-' }]}
              />
              <div className="mt-4 flex flex-col gap-1">
                <Caption1 className="w-full text-left">Description</Caption1>
                <Body className="w-full text-left">{description ?? '-'}</Body>
              </div>
            </div>
            <AlbumImage src={imageUrl} title={title} className="h-50 w-30" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
