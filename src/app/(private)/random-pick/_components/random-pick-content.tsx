'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ContinuePicker } from './continue-picker';
import { CustomTextPicker } from './custom-text-picker';
import { ItemsPoolPicker } from './items-pool-picker';
import { ListsPicker } from './lists-picker';
import type { SpinCandidate } from './types';

const RandomReelDynamic = dynamic(
  () => import('./random-reel').then((mod) => ({ default: mod.RandomReel })),
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

const EMPTY_POOL_KEY = 'empty';

function getPoolKey(candidates: SpinCandidate[]): string {
  if (candidates.length === 0) return EMPTY_POOL_KEY;

  return [...candidates]
    .map((c) => c.id)
    .sort()
    .join(',');
}

export function RandomPickContent() {
  const [spinCandidates, setSpinCandidates] = useState<SpinCandidate[]>([]);

  const poolKey = getPoolKey(spinCandidates);

  return (
    <div className="flex w-full flex-col gap-8">
      <RandomReelDynamic key={poolKey} candidates={spinCandidates} />

      <div className="bg-card/40 border-border/50 w-full rounded-2xl border p-4 shadow-lg backdrop-blur-md sm:p-6">
        <Tabs defaultValue="lists" className="w-full">
          <TabsList className="bg-muted/80 mb-4 w-full flex-wrap gap-1 sm:mb-6">
            <TabsTrigger value="lists" className="flex-1 sm:flex-none">
              Lists
            </TabsTrigger>
            <TabsTrigger value="continue" className="flex-1 sm:flex-none">
              Continue
            </TabsTrigger>
            <TabsTrigger value="pool" className="flex-1 sm:flex-none">
              Pool
            </TabsTrigger>
            <TabsTrigger value="text" className="flex-1 sm:flex-none">
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lists" className="mt-0">
            <ListsPicker onPoolChange={setSpinCandidates} />
          </TabsContent>

          <TabsContent value="continue" className="mt-0">
            <ContinuePicker onPoolChange={setSpinCandidates} />
          </TabsContent>

          <TabsContent value="pool" className="mt-0">
            <ItemsPoolPicker onPoolChange={setSpinCandidates} />
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <CustomTextPicker onPoolChange={setSpinCandidates} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
