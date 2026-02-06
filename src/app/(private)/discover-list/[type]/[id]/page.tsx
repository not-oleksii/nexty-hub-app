import { ItemStatus } from '@prisma/client';

import { ContentWrapper } from '@/components/layout/content';
import { Body } from '@/components/typography/body';
import { Caption1 } from '@/components/typography/caption1';
import { Title } from '@/components/typography/title';
import { AlbumImage } from '@/components/ui/album-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DetailsList } from '@/components/ui/details-list';
import { getDiscoverItemById } from '@/server/api/discover';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

import { ItemCardActions } from './_components/item-card-actions';
import { DiscoverItemPageProps } from './types';

export default async function DiscoverItemPage({
  params,
}: DiscoverItemPageProps) {
  const { type, id } = await params;
  const { title, category, description, imageUrl, status } =
    await getDiscoverItemById(mapItemTypeToPrisma(type), id);

  return (
    <ContentWrapper className="flex justify-center">
      <Card className="max-w-3xl">
        <CardContent>
          <div className="flex justify-between gap-6 max-md:flex-col max-md:gap-4">
            <div className="flex max-w-sm flex-col gap-3">
              <div className="flex items-center gap-2">
                <Title>{title}</Title>{' '}
                <Badge
                  variant={status === ItemStatus.DONE ? 'default' : 'outline'}
                >
                  {status}
                </Badge>
              </div>
              <DetailsList
                items={[
                  {
                    label: 'Category',
                    value: category ?? '-',
                  },
                ]}
              />
              <div className="flex flex-col gap-1">
                <Caption1>Description</Caption1>
                <Body>{description}</Body>
              </div>
              <ItemCardActions itemId={id} />
            </div>
            <div className="flex max-md:justify-center">
              <AlbumImage
                src={imageUrl}
                title={title}
                className="w-3xs"
                aspectRatio="aspect-10/16"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentWrapper>
  );
}
