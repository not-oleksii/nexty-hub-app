import Link from 'next/link';

import { QueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { ROUTES } from '@/constants/routes';
import { isValidFromPath } from '@/lib/utils/url';
import { discoverQueries } from '@/server/api/queries/discover.queries';
import { mapItemTypeToPrisma } from '@/server/utils/prisma-maps';

import { DiscoverItemDetails } from './_components/discover-item-details';

type DiscoverItemPageProps = {
  params: Promise<{ type: string; id: string }>;
  searchParams?: Promise<{ from?: string }>;
};

export default async function DiscoverItemPage({
  params,
  searchParams,
}: DiscoverItemPageProps) {
  const { type, id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { from } = resolvedSearchParams ?? {};
  const queryClient = new QueryClient();
  const prismaType = mapItemTypeToPrisma(type);
  await queryClient.prefetchQuery(discoverQueries.detail(prismaType, id));

  return (
    <ContentWrapper className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-3xl">
        <Link
          href={
            from && isValidFromPath(from)
              ? from
              : `${ROUTES.discoverList.root}/${type}`
          }
          className="text-primary inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to list
        </Link>
      </div>
      <div className="w-full max-w-3xl">
        <DiscoverItemDetails type={prismaType} id={id} />
      </div>
    </ContentWrapper>
  );
}
