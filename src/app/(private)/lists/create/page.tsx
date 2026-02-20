import Link from 'next/link';

import { ContentWrapper } from '@/components/layout/content';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Card, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

import { CreateListForm } from '../../../../components/forms/create-list-form';

export default function CreateListPage() {
  return (
    <ContentWrapper className="flex flex-col gap-6">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Header>Create List</Header>
              <Caption size="base">
                Create a new list to organize your discover items
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
        <CreateListForm />
      </Card>
    </ContentWrapper>
  );
}
