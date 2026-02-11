'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { ItemType } from '@generated/prisma/enums';

import { Button } from '@/components/ui/button';
import {
  getRandomDiscoverItem,
  getRandomDiscoverItemByType,
} from '@/server/api/discover';

import { Spinner } from './ui/spinner';

type RandomPickButtonProps = {
  type?: ItemType;
  currentItemId?: string;
};

export function RandomPickButton({
  type,
  currentItemId,
}: RandomPickButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handlePickRandom = useCallback(async () => {
    setIsLoading(true);
    try {
      let item;
      let attempts = 0;
      const maxAttempts = 10;

      // If `random_scope=all` is present in the URL, keep picking across the whole list
      const preserveGlobalRandom =
        !!searchParams && searchParams.get('random_scope') === 'all';

      // Keep fetching until we get a different item (if currentItemId is provided)
      do {
        item =
          !type || preserveGlobalRandom
            ? await getRandomDiscoverItem()
            : await getRandomDiscoverItemByType(type);
        attempts++;
      } while (
        currentItemId &&
        item.id === currentItemId &&
        attempts < maxAttempts
      );
      const shouldPreserveScope = preserveGlobalRandom || !type;
      const scopeParam = shouldPreserveScope ? '&random_scope=all' : '';

      router.push(
        `/discover-list/${item.type.toLowerCase()}/${item.id}?random=true${scopeParam}`,
      );
    } catch (error) {
      console.error('Error picking random item:', error);
      setIsLoading(false);
    }
  }, [router, type, currentItemId, searchParams]);

  return (
    <Button
      onClick={handlePickRandom}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
          Picking...
        </>
      ) : (
        'Pick!'
      )}
    </Button>
  );
}
