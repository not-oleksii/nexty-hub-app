'use client';

import Link from 'next/link';

import { DiscoverItemType } from '@generated/prisma/enums';

import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Skeleton } from '@/components/ui/skeleton';
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
  const href = ROUTES.discover.item(typeSlug, item.id);

  return (
    <Link href={href} className="block">
      <Card
        variant="interactive"
        className="group flex h-full flex-col overflow-hidden"
      >
        <CardContent className="p-0">
          <DynamicCover
            title={item.title}
            src={item.imageUrl}
            aspectRatio="aspect-4/3"
            strictHosts
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

export function DiscoverItemCardSkeleton() {
  return (
    <div className="border-border/50 bg-card/40 flex flex-col overflow-hidden rounded-xl border backdrop-blur-md">
      <Skeleton className="aspect-video w-full shrink-0 rounded-none" />
      <div className="flex flex-col gap-1.5 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
