import { ContentWrapper } from '@/components/layout/content';
import { Header1 } from '@/components/typography/header1';
import type { DiscoverItemDto } from '@/server/api/discover';
import { getDiscoverListByType } from '@/server/api/discover';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

import { DiscoverItem } from './_components/discover-item';
import { DiscoverListPageProps } from './types';

export default async function DiscoverMoviesPage({
  params,
}: DiscoverListPageProps) {
  const { type } = await params;
  const items: DiscoverItemDto[] = await getDiscoverListByType(
    mapItemTypeToPrisma(type),
  );

  return (
    <ContentWrapper>
      <Header1>{type.toUpperCase()}</Header1>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <DiscoverItem key={item.id} item={item} />
        ))}
      </div>
    </ContentWrapper>
  );
}
