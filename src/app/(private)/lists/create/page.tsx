import Link from 'next/link';

import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';
import { Card, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

import { CreateListForm } from './_components/create-list-form';

export default function CreateListPage() {
  return (
    <ContentWrapper className="flex flex-col gap-6">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Header1>Create List</Header1>
              <Caption1>
                Create a new list to organize your discover items
              </Caption1>
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
