import { QueryClient } from '@tanstack/react-query';

import { ContentWrapper } from '@/components/layout/content';
import { Card, CardContent } from '@/components/ui/card';
import { discoverQueries } from '@/server/api/queries/discover.queries';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

import { DiscoverItemDetails } from './_components/discover-item-details';
import { DiscoverItemPageProps } from './types';

export default async function DiscoverItemPage({
  params,
}: DiscoverItemPageProps) {
  const { type, id } = await params;
  const queryClient = new QueryClient();
  const prismaType = mapItemTypeToPrisma(type);
  await queryClient.prefetchQuery(discoverQueries.detail(prismaType, id));

  return (
    <ContentWrapper className="flex justify-center">
      <Card className="max-w-3xl">
        <CardContent>
          <DiscoverItemDetails type={prismaType} id={id} />
        </CardContent>
      </Card>
    </ContentWrapper>
  );
}
