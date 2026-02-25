'use client';

import { useCallback, useMemo, useState } from 'react';

import { TrackingStatus } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { Caption } from '@/components/typography/caption';
import { Subtitle } from '@/components/typography/subtitle';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils/common';
import { discoverQueries } from '@/server/api/queries/discover.queries';

import { toggleSetMember } from '../helpers';
import { PoolItemSkeleton } from './pool-item-skeleton';
import type { SpinCandidate } from './types';

const ALL_STATUS = 'all';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_STATUS, label: 'All' },
  { value: TrackingStatus.BACKLOG, label: 'Backlog' },
  { value: TrackingStatus.IN_PROGRESS, label: 'In progress' },
  { value: TrackingStatus.COMPLETED, label: 'Completed' },
  { value: TrackingStatus.DROPPED, label: 'Dropped' },
  { value: TrackingStatus.ON_HOLD, label: 'On hold' },
];

interface ItemsPoolPickerProps {
  onPoolChange: (candidates: SpinCandidate[]) => void;
}

export function ItemsPoolPicker({ onPoolChange }: ItemsPoolPickerProps) {
  const { data: items = [], isLoading } = useQuery(discoverQueries.tracked());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = items;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }

    if (statusFilter !== ALL_STATUS) {
      list = list.filter((item) => item.status === statusFilter);
    }

    return list;
  }, [items, search, statusFilter]);

  const toggleSelection = useCallback(
    (id: string) => {
      const next = toggleSetMember(selectedIds, id);
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
          No tracked items yet
        </Subtitle>
        <Caption className="text-muted-foreground mt-1 text-center">
          Add items from Discover and track them to build your pool.
        </Caption>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        {filtered.map((item) => {
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

      {filtered.length === 0 && (
        <Caption className="text-muted-foreground text-center">
          No items match your filters.
        </Caption>
      )}
    </div>
  );
}
