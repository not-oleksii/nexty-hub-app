'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { DiscoverItemType } from '@generated/prisma/enums';

import { Button } from '@/components/ui/button';
import { UserListWithProgress } from '@/server/lib/lists';
import {
  getArrayOfRandomItemsByLength,
  getRandomItem,
  getRandomTitle,
} from '@/server/utils/random';

import { getUniqueReels } from '../helpers';
import { ReelItem } from './reel-item';
import { WinnerDialog } from './winner-dialog';

export type Reel = Pick<
  UserListWithProgress,
  'discoverItems'
>['discoverItems'][number];

interface RandomReelProps {
  reels: Reel[];
}

const ITEM_WIDTH = 180;
const GAP = 16;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP;
const TRACK_LENGTH = 60;
const WIN_INDEX = 50;

const tempReels = Array.from({ length: 15 }, (_, index) => {
  const title = getRandomTitle();

  return {
    category: 'Lorem',
    description: 'Lorem ipsum dolor sit amet',
    id: `title-${index}`,
    imageUrl: null,
    owner: null,
    title: title,
    type: DiscoverItemType.OTHER,
  };
}) as Reel[];

export function RandomReel({ reels }: RandomReelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningComplete, setIsSpinningComplete] = useState(false);
  const [offset, setOffset] = useState(0);
  const [spinTrack, setSpinTrack] = useState<Reel[]>([]);
  const [pickedItem, setPickedItem] = useState<Reel | null>(null);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseItems = useMemo(() => {
    if (reels.length === 0) return tempReels;

    return getArrayOfRandomItemsByLength(getUniqueReels(reels), 15);
  }, [reels]);

  const onPickClick = useCallback(() => {
    if (!containerRef.current) return;

    const uniqueReels = getUniqueReels(reels);
    const pool = uniqueReels.length > 0 ? uniqueReels : tempReels;
    const winner = getRandomItem(pool);

    if (!winner) return;

    setIsSpinning(false);
    setIsSpinningComplete(false);
    setOffset(0);
    setPickedItem(winner);

    const newTrack = getArrayOfRandomItemsByLength(pool, TRACK_LENGTH);

    newTrack[WIN_INDEX] = winner;

    setSpinTrack(newTrack);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsSpinning(true);

        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const centerOffset = containerWidth / 2 - ITEM_WIDTH / 2;
        const targetPosition = WIN_INDEX * TOTAL_ITEM_WIDTH;
        const randomNudge = Math.floor(Math.random() * 60) - 100;
        const finalOffset = -(targetPosition - centerOffset + randomNudge);

        setOffset(finalOffset);
      });
    });
  }, [reels]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (!isSpinning) return;
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== 'transform') return;

      setIsSpinning(false);
      setIsSpinningComplete(true);
      setIsWinnerDialogOpen(true);
    },
    [isSpinning],
  );

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="bg-background/50 relative h-[250px] w-full overflow-hidden rounded-xl shadow-inner"
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex h-full w-max items-center ${
            !isSpinning && !pickedItem ? 'animate-infinite-scroll' : ''
          }`}
          style={{
            transform:
              isSpinning || pickedItem ? `translateX(${offset}px)` : '',
            transition: isSpinning
              ? 'transform 10s cubic-bezier(0.15, 0.85, 0.15, 1)'
              : 'none',
          }}
        >
          {isSpinning || pickedItem ? (
            <div className="flex gap-4 pr-4">
              {spinTrack.map(({ title, imageUrl }, itemIndex) => (
                <div key={`spin-${itemIndex}`} className="w-[180px] shrink-0">
                  <ReelItem title={title} imageUrl={imageUrl} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {Array.from({ length: 2 }).map((_, groupIndex) => (
                <div
                  key={`group-${groupIndex}-container`}
                  className="flex gap-4 pr-4"
                >
                  {baseItems.map(({ title, imageUrl }, itemIndex) => (
                    <div
                      key={`idle-${groupIndex}-${title}-${itemIndex}`}
                      className="w-[180px] shrink-0"
                    >
                      <ReelItem title={title} imageUrl={imageUrl} />
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background))_0%,transparent_15%,transparent_85%,hsl(var(--background))_100%)]" />
        <div className="bg-primary pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 shadow-[0_0_15px_hsl(var(--primary))]" />
      </div>

      <div className="mt-4 flex w-full flex-col items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={onPickClick}
          disabled={reels.length === 0 || isSpinning}
          className="w-32"
        >
          {isSpinning ? 'Spinning...' : 'PICK!'}
        </Button>

        <div className="flex h-3 items-center justify-center">
          {isSpinningComplete && pickedItem && (
            <p className="text-primary animate-entrance-fade-zoom font-bold">
              Winner: {pickedItem.title}
            </p>
          )}
        </div>
      </div>

      <WinnerDialog
        open={isWinnerDialogOpen}
        winner={pickedItem}
        onOpenChange={setIsWinnerDialogOpen}
      />
    </div>
  );
}
