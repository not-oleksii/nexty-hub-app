'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

import { Subtitle } from '@/components/typography/subtitle';
import { Skeleton } from '@/components/ui/skeleton';

import { ListsGrid } from './lists-grid';
import { Reel } from './random-reel';

const RandomReel = dynamic(
  () => import('./random-reel').then((mod) => mod.RandomReel),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center gap-4">
        <Skeleton className="bg-muted/50 h-[250px] w-full animate-pulse rounded-xl" />
        <Skeleton className="bg-muted/50 h-12 w-[150px] animate-pulse rounded-xl" />
      </div>
    ),
  },
);

export function RandomPickContent() {
  const [selectedReels, setSelectedReels] = useState<Reel[]>([]);

  const onListClick = useCallback((selectedReels: Reel[]) => {
    setSelectedReels(selectedReels);
  }, []);

  return (
    <div className="w-full">
      <RandomReel reels={selectedReels} />
      <div className="mt-8 flex flex-col gap-4">
        <Subtitle>Select lists to pick from</Subtitle>
        <ListsGrid onListClick={onListClick} />
      </div>
    </div>
  );
}
