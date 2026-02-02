import Link from 'next/link';

import { AddDiscoverItemForm } from '@/components/forms/discover-list-add-form';
import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AddDiscoverItemPage() {
  return (
    <ContentWrapper className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Header1>Add item</Header1>
          <Caption1>
            Create a new discover item (movie/series/game/book/...)
          </Caption1>
        </div>
        <Link
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm"
          href="/discover-list"
        >
          Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item details</CardTitle>
          <CardDescription>
            All fields except title are optional.
          </CardDescription>
        </CardHeader>
        <AddDiscoverItemForm />
      </Card>
    </ContentWrapper>
  );
}
