'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ItemType } from '@generated/prisma/enums';
import {
  getRandomDiscoverItem,
  getRandomDiscoverItemByType,
} from '@/server/api/discover';

type RandomPickButtonProps = {
  type?: ItemType;
  currentItemId?: string;
};

export function RandomPickButton({
  type,
  currentItemId,
}: RandomPickButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePickRandom = async () => {
    setIsLoading(true);
    try {
      let item;
      let attempts = 0;
      const maxAttempts = 10;

      // Keep fetching until we get a different item (if currentItemId is provided)
      do {
        item = type
          ? await getRandomDiscoverItemByType(type)
          : await getRandomDiscoverItem();
        attempts++;
      } while (
        currentItemId &&
        item.id === currentItemId &&
        attempts < maxAttempts
      );

      router.push(
        `/discover-list/${item.type.toLowerCase()}/${item.id}?isRandom=true`,
      );
    } catch (error) {
      console.error('Error picking random item:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePickRandom}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Picking...
        </>
      ) : (
        'Pick!'
      )}
    </Button>
  );
}
