import { ItemType } from '@generated/prisma/enums';
import { SparkleIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Header1 } from '@/components/typography/header1';
import type { DiscoverItemDto } from '@/server/api/discover';
import { getDiscoverListByType } from '@/server/api/discover';

import { DiscoverListCard } from './_components/discover-list-card';

export default async function DiscoverListPage() {
  const [
    moviesResult,
    seriesResult,
    gamesResult,
    booksResult,
    coursesResult,
    otherResult,
  ] = await Promise.allSettled([
    getDiscoverListByType(ItemType.MOVIE),
    getDiscoverListByType(ItemType.SERIES),
    getDiscoverListByType(ItemType.GAME),
    getDiscoverListByType(ItemType.BOOK),
    getDiscoverListByType(ItemType.COURSE),
    getDiscoverListByType(ItemType.OTHER),
  ]);

  const getItems = (result: PromiseSettledResult<DiscoverItemDto[]>) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    return [];
  };

  return (
    <ContentWrapper>
      <div className="flex items-center gap-2">
        <Header1>Discover your next adventure</Header1>
        <SparkleIcon className="text-primary" fill="currentColor" />
      </div>

      <div className="3xl:grid-cols-4 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DiscoverListCard
          type={ItemType.MOVIE}
          items={getItems(moviesResult)}
        />
        <DiscoverListCard
          type={ItemType.SERIES}
          items={getItems(seriesResult)}
        />
        <DiscoverListCard type={ItemType.GAME} items={getItems(gamesResult)} />
        <DiscoverListCard type={ItemType.BOOK} items={getItems(booksResult)} />
        <DiscoverListCard
          type={ItemType.COURSE}
          items={getItems(coursesResult)}
        />
        <DiscoverListCard type={ItemType.OTHER} items={getItems(otherResult)} />
      </div>
    </ContentWrapper>
  );
}
