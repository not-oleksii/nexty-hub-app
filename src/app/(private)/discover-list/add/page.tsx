import Link from 'next/link';

import { AddDiscoverItemForm } from '@/app/(private)/discover-list/add/_components/discover-list-add-form';
import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';
import { Card, CardHeader } from '@/components/ui/card';

export default function AddDiscoverItemPage() {
  return (
    <ContentWrapper className="flex flex-col gap-6">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Header1>Add Discover Item</Header1>
              <Caption1>Add a new discover item to your list</Caption1>
            </div>
            <Link
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm"
              href="/discover-list"
            >
              Back
            </Link>
          </div>
        </CardHeader>
        <AddDiscoverItemForm />
      </Card>
    </ContentWrapper>
  );
}
