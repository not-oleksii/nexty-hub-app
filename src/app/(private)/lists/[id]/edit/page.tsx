import Link from 'next/link';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { CreateListForm } from '@/components/forms/create-list-form';
import { ContentWrapper } from '@/components/layout/content';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Card, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { listsQueries } from '@/server/api/queries/lists.queries';
import { getListById } from '@/server/lib/lists';

type EditListPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditListPage({ params }: EditListPageProps) {
  const { id } = await params;
  const { data: list } = await getListById(id);

  const queryClient = new QueryClient();
  if (list) {
    queryClient.setQueryData(listsQueries.detail(id).queryKey, list);
  }

  if (!list) {
    return (
      <ContentWrapper className="flex flex-col gap-6">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <p className="text-muted-foreground">
              List not found or you don&apos;t have permission to edit it.
            </p>
            <Link
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
              href={ROUTES.lists.root}
            >
              Back to lists
            </Link>
          </CardHeader>
        </Card>
      </ContentWrapper>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentWrapper className="flex flex-col gap-6">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Header>Edit List</Header>
                <Caption size="base">
                  Edit the list to organize your discover items
                </Caption>
              </div>
              <Link
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm"
                href={ROUTES.lists.root}
              >
                Back
              </Link>
            </div>
          </CardHeader>
          <CreateListForm list={list} />
        </Card>
      </ContentWrapper>
    </HydrationBoundary>
  );
}
