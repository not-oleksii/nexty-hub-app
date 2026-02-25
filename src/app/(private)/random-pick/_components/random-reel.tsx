'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import {
  getArrayOfRandomItemsByLength,
  getRandomItem,
  getRandomTitle,
} from '@/server/utils/random';

import { getUniqueCandidates, isWinnerLinkable } from '../helpers';
import { ReelItem } from './reel-item';
import type { SpinCandidate } from './types';
import { WinnerDialog } from './winner-dialog';

interface RandomReelProps {
  candidates: SpinCandidate[];
}

const ITEM_WIDTH = 180;
const GAP = 16;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP;
const TRACK_LENGTH = 60;
const WIN_INDEX = 50;

const tempCandidates: SpinCandidate[] = Array.from({ length: 15 }, (_, i) => ({
  id: `temp-${i}`,
  name: getRandomTitle(),
  image: null,
}));

export function RandomReel({ candidates }: RandomReelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningComplete, setIsSpinningComplete] = useState(false);
  const [offset, setOffset] = useState(0);
  const [spinTrack, setSpinTrack] = useState<SpinCandidate[]>([]);
  const [pickedItem, setPickedItem] = useState<SpinCandidate | null>(null);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseItems = useMemo(() => {
    if (candidates.length === 0) return tempCandidates;

    return getArrayOfRandomItemsByLength(getUniqueCandidates(candidates), 15);
  }, [candidates]);

  const onPickClick = useCallback(() => {
    if (!containerRef.current) return;

    const unique = getUniqueCandidates(candidates);
    const pool = unique.length > 0 ? unique : tempCandidates;
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
  }, [candidates]);

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
              {spinTrack.map(({ name, image }, itemIndex) => (
                <div key={`spin-${itemIndex}`} className="w-[180px] shrink-0">
                  <ReelItem title={name} imageUrl={image ?? null} />
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
                  {baseItems.map(({ id, name, image }, itemIndex) => (
                    <div
                      key={`idle-${groupIndex}-${id}-${itemIndex}`}
                      className="w-[180px] shrink-0"
                    >
                      <ReelItem title={name} imageUrl={image ?? null} />
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
          disabled={candidates.length < 2 || isSpinning}
          className="w-32"
        >
          {isSpinning ? 'Spinning...' : `PICK! (${candidates.length})`}
        </Button>

        <div className="flex min-h-12 flex-col items-center justify-center gap-1">
          {isSpinningComplete && pickedItem && (
            <p className="text-primary animate-entrance-fade-zoom font-bold">
              Winner:{' '}
              {isWinnerLinkable(pickedItem) ? (
                <Link
                  href={ROUTES.discover.item(pickedItem.type!, pickedItem.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-90"
                >
                  {pickedItem.name}
                </Link>
              ) : (
                pickedItem.name
              )}
            </p>
          )}
          {!isSpinning && !pickedItem && candidates.length < 2 && (
            <p className="text-muted-foreground text-center text-sm">
              Select at least 2 items to spin
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
