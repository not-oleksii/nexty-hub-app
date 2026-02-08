'use client';

import { AddToListButton } from '@/components/add-to-list-button';

interface ItemCardActionsProps {
  itemId: string;
}

export function ItemCardActions({ itemId }: ItemCardActionsProps) {
  return (
    <div className="flex w-full gap-2">
      <AddToListButton itemId={itemId} />
    </div>
  );
}
