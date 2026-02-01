import { ItemType } from '@prisma/client';

import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';
import type { DiscoverItemDto } from '@/server/api/discover';
import { getDiscoverListByType } from '@/server/api/discover';

export default async function DiscoverMoviesPage() {
  const items: DiscoverItemDto[] = await getDiscoverListByType(ItemType.MOVIE);

  return (
    <ContentWrapper>
      <Header1>Movies</Header1>
      <Caption1>Movies only</Caption1>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card rounded-xl border p-4">
            <div className="mt-1 font-medium">{item.title}</div>
            {item.category ? (
              <div className="text-muted-foreground mt-1 text-xs">
                {item.category}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ContentWrapper>
  );
}
