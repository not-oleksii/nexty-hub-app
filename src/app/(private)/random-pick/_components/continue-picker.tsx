'use client';

import { useCallback, useState } from 'react';

import { TrackingStatus } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { Caption } from '@/components/typography/caption';
import { Subtitle } from '@/components/typography/subtitle';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/common';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import type { SpinCandidate } from './types';

interface ContinuePickerProps {
  onPoolChange: (candidates: SpinCandidate[]) => void;
}

function PoolItemSkeleton() {
  return (
    <div className="border-border/50 bg-card/40 flex w-[140px] flex-col overflow-hidden rounded-xl border">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="p-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function ContinuePicker({ onPoolChange }: ContinuePickerProps) {
  const { data: items = [], isLoading } = useQuery(
    discoverQueries.tracked(TrackingStatus.IN_PROGRESS),
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback(
    (id: string) => {
      const next = new Set(selectedIds);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      setSelectedIds(next);

      const pool = items
        .filter((item) => next.has(item.id))
        .map((item) => ({
          id: item.id,
          name: item.title,
          image: item.imageUrl,
          type: item.type,
        }));

      onPoolChange(pool);
    },
    [items, onPoolChange, selectedIds],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <PoolItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-border/50 bg-card/40 flex flex-col items-center justify-center rounded-xl border py-16 backdrop-blur-md">
        <Subtitle size="sm" className="text-muted-foreground text-center">
          No items in progress
        </Subtitle>
        <Caption className="text-muted-foreground mt-1 text-center">
          Start tracking something from Discover to see it here.
        </Caption>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const selected = selectedIds.has(item.id);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleSelection(item.id)}
            className={cn(
              'bg-card/40 border-border/50 hover:border-primary/50 flex w-[140px] cursor-pointer flex-col overflow-hidden rounded-xl border text-left shadow-sm transition-all',
              selected && 'ring-primary bg-primary/10 ring-2',
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <DynamicCover
                title={item.title}
                src={item.imageUrl}
                aspectRatio="aspect-4/3"
                strictHosts
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-2">
              <Caption className="line-clamp-2 font-medium">
                {item.title}
              </Caption>
            </div>
          </button>
        );
      })}
    </div>
  );
}
