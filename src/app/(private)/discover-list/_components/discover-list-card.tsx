import Link from 'next/link';

import { ItemStatus, ItemType } from '@prisma/client';
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
import { ROUTES } from '@/constants/routes';
import { DiscoverItemDto } from '@/server/api/discover';

type DiscoverListCardProps = {
  type: ItemType;
  items: DiscoverItemDto[];
};

export function DiscoverListCard({ type, items }: DiscoverListCardProps) {
  const itemTypeTitleMap: Record<ItemType, string> = {
    [ItemType.MOVIE]: 'Movie',
    [ItemType.SERIES]: 'Series',
    [ItemType.GAME]: 'Game',
    [ItemType.BOOK]: 'Book',
    [ItemType.COURSE]: 'Course',
    [ItemType.OTHER]: 'Other',
  };

  const itemTypeIconMap: Record<ItemType, React.ReactNode> = {
    [ItemType.MOVIE]: <ClapperboardIcon />,
    [ItemType.SERIES]: <FilmIcon />,
    [ItemType.GAME]: <Gamepad2Icon />,
    [ItemType.BOOK]: <BookIcon />,
    [ItemType.COURSE]: <BrainIcon />,
    [ItemType.OTHER]: <SparklesIcon />,
  };

  const totalItems = items.length;
  const completedItems = items.filter(
    (item) => item.status === ItemStatus.DONE,
  ).length;

  const progress = (completedItems / totalItems) * 100;

  if (items.length === 0) {
    return null;
  }

  return (
    <Link href={`${ROUTES.discoverList.root}/${type.toLowerCase()}`}>
      <Card className="md:min-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            {itemTypeIconMap[type]}
            <div className="flex items-center gap-2 pl-2">
              <Header2>{itemTypeTitleMap[type]}</Header2>
              <Badge>{items.length}</Badge>
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
