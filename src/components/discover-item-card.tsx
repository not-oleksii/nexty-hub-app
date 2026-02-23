'use client';

import Link from 'next/link';

import { DiscoverItemType } from '@generated/prisma/enums';

import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { AlbumImage } from '@/components/ui/album-image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { mapPrismaToItemType } from '@/server/utils/prisma-maps';

type DiscoverItemCardItem = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
};

type DiscoverItemCardProps = {
  item: DiscoverItemCardItem;
};

export function DiscoverItemCard({ item }: DiscoverItemCardProps) {
  const typeSlug = mapPrismaToItemType(item.type as DiscoverItemType);
  const href = `${ROUTES.discoverList.root}/${typeSlug}/${item.id}`;

  return (
    <Link href={href} className="block">
      <Card
        variant="interactive"
        className="group flex h-full flex-col overflow-hidden"
      >
        <CardContent className="p-0">
          <AlbumImage
            src={item.imageUrl}
            title={item.title}
            aspectRatio="aspect-4/3"
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-0.5 p-3">
          <Body size="sm" className="line-clamp-1 font-medium">
            {item.title}
          </Body>
          {item.category && (
            <Caption size="xs" className="text-muted-foreground line-clamp-1">
              {item.category}
            </Caption>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
