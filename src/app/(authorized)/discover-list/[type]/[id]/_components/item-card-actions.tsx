'use client';

import { useCallback } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ItemCardActionsProps {
  itemId: string;
}

export function ItemCardActions({ itemId }: ItemCardActionsProps) {
  const onAddToListClick = useCallback(() => {
    console.log('>>> add to list', itemId);
  }, [itemId]);

  return (
    <div className="flex w-full gap-2">
      <Button
        variant="outline"
        onClick={onAddToListClick}
        className="max-md:w-full"
      >
        <PlusIcon /> Add To List
      </Button>
    </div>
  );
}
