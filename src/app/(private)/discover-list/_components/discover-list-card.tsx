'use client';

import Link from 'next/link';

import { DiscoverItemType } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';
import {
  BookIcon,
  BrainIcon,
  ClapperboardIcon,
  FilmIcon,
  Gamepad2Icon,
  SparklesIcon,
} from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Header2 } from '@/components/typography/header2';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { discoverQueries } from '@/server/api/queries/discover.queries';

interface DiscoverListCardProps {
  type: DiscoverItemType;
}

const itemTypeTitleMap: Record<DiscoverItemType, string> = {
  [DiscoverItemType.MOVIE]: 'Movie',
  [DiscoverItemType.SERIES]: 'Series',
  [DiscoverItemType.GAME]: 'Game',
  [DiscoverItemType.BOOK]: 'Book',
  [DiscoverItemType.COURSE]: 'Course',
  [DiscoverItemType.OTHER]: 'Other',
};

const itemTypeIconMap: Record<DiscoverItemType, React.ReactNode> = {
  [DiscoverItemType.MOVIE]: <ClapperboardIcon />,
  [DiscoverItemType.SERIES]: <FilmIcon />,
  [DiscoverItemType.GAME]: <Gamepad2Icon />,
  [DiscoverItemType.BOOK]: <BookIcon />,
  [DiscoverItemType.COURSE]: <BrainIcon />,
  [DiscoverItemType.OTHER]: <SparklesIcon />,
};

export function DiscoverListCard({ type }: DiscoverListCardProps) {
  const { data, isLoading, isError } = useQuery(discoverQueries.type(type));

  const totalItems = data?.length || 0;
  const completedItems = data?.filter((item) => item.isCompleted).length || 0;

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  if (isLoading) {
    return <DiscoverListCardSkeleton />;
  }

  if (!data?.length || isError) return null;

  return (
    <Link href={`${ROUTES.discoverList.root}/${type.toLowerCase()}`}>
      <Card variant="interactive" className="md:min-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            {itemTypeIconMap[type]}
            <div className="flex items-center gap-2 pl-2">
              <Header2>{itemTypeTitleMap[type]}</Header2>
              <Badge>{data?.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Body className="w-full text-left">
            Your progress: {completedItems} / {totalItems}
          </Body>
          <Progress value={progress} />
        </CardFooter>
      </Card>
    </Link>
  );
}

export function DiscoverListCardSkeleton() {
  return (
    <Card className="md:min-w-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-30" />
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-2 w-full" />
      </CardFooter>
    </Card>
  );
}
