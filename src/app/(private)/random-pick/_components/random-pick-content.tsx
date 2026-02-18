'use client';

import { useCallback, useState } from 'react';

import { Subtitle1 } from '@/components/typography/subtitle1';

import { ListsGrid } from './lists-grid';
import { RandomReel, Reel } from './random-reel';

export function RandomPickContent() {
  const [selectedReels, setSelectedReels] = useState<Reel[]>([]);

  const onListClick = useCallback((selectedReels: Reel[]) => {
    setSelectedReels(selectedReels);
    console.log(selectedReels);
  }, []);

  return (
    <div className="w-full">
      <RandomReel reels={selectedReels} />
      <div className="mt-8 flex flex-col gap-4">
        <Subtitle1>Select lists to pick from</Subtitle1>
        <ListsGrid onListClick={onListClick} />
      </div>
    </div>
  );
}
