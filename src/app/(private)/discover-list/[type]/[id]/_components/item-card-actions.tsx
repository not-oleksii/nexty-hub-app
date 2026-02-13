'use client';

import { AddToListButton } from '@/components/add-to-list-button';

interface ItemCardActionsProps {
  discoverItemId: string;
}

export function ItemCardActions({ discoverItemId }: ItemCardActionsProps) {
  return (
    <div className="flex w-full gap-2">
      <AddToListButton discoverItemId={discoverItemId} />
    </div>
  );
}
