'use client';

import { useMemo } from 'react';

import { UserListWithProgress } from '@/server/lib/lists';
import { getRandomTitle } from '@/server/utils/random';

import { ReelItem } from './reel-item';

export type Reels = Pick<
  UserListWithProgress,
  'discoverItems'
>['discoverItems'];

interface RandomReelProps {
  reels: Reels;
}

const tempReels = Array.from({ length: 15 }, (_, index) => {
  const title = getRandomTitle();

  return {
    category: 'Sci-Fi',
    description:
      'A team travels through a wormhole in search of a new home for humanity.',
    id: '15268af8-9ece-470e-ba62-7fce5e8a9c3a',
    imageUrl: 'https://i.imgur.com/bVXo3zK.jpeg',
    owner: null,
    title: 'Interstellar',
    type: 'MOVIE',
  };
}) as Reels;

export function RandomReel({ reels }: RandomReelProps) {
  const items = useMemo(() => (reels.length > 0 ? reels : tempReels), [reels]);

  console.log(items);

  return (
    <div className="relative h-[250px] w-full overflow-hidden rounded-xl">
      <div className="animate-infinite-scroll flex h-full w-max items-center">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`group-${index}-container`} className="flex gap-4 pr-4">
            {items.map(
              ({ title, imageUrl, description, category, type }, itemIndex) => (
                <ReelItem
                  key={`group-${title}-${itemIndex}`}
                  title={title}
                  imageUrl={imageUrl}
                />
              ),
            )}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--primary)/0.8)_1%,transparent_5%,transparent_95%,hsl(var(--primary)/0.8)_99%)]" />
      <div className="bg-primary pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2" />
    </div>
  );
}
