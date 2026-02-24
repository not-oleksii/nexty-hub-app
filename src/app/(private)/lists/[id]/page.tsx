import Link from 'next/link';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { ContentWrapper } from '@/components/layout/content';
import { ListDetailsView } from '@/components/common/list/list-details-view';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import type { UserListViewDto } from '@/server/api/lists';
import { listsQueries } from '@/server/api/queries/lists.queries';
import { getListViewData } from '@/server/lib/lists';

function toViewDto(
  list: NonNullable<Awaited<ReturnType<typeof getListViewData>>['data']>,
): UserListViewDto {
  return {
    ...list,
    createdAt:
      typeof list.createdAt === 'string'
        ? list.createdAt
        : list.createdAt.toISOString(),
    updatedAt:
      typeof list.updatedAt === 'string'
        ? list.updatedAt
        : list.updatedAt.toISOString(),
  };
}

type ListDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { id } = await params;
  const { data: rawList } = await getListViewData(id);

  const list = rawList ? toViewDto(rawList) : null;
  const queryClient = new QueryClient();
  if (list) {
    queryClient.setQueryData(listsQueries.view(id).queryKey, list);
  }

  if (!list) {
    return (
      <ContentWrapper className="flex justify-center">
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
            <p className="text-muted-foreground text-center">
              List not found or you don&apos;t have access to it.
            </p>
            <Link
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
              href={ROUTES.lists.root}
            >
              Back to lists
            </Link>
          </CardContent>
        </Card>
      </ContentWrapper>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper>
        <ListDetailsView list={list} />
      </ContentWrapper>
    </HydrationBoundary>
  );
}
