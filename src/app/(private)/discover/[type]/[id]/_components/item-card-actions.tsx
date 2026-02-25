'use client';

import { useEffect, useState } from 'react';

import { DiscoverItemType, TrackingStatus } from '@generated/prisma/enums';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { AddToListButton } from '@/components/common/list/add-to-list-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn } from '@/lib/utils/common';
import type { DiscoverItemDto } from '@/server/api/discover';
import {
  discoverKeys,
  discoverMutations,
} from '@/server/api/queries/discover.queries';

interface ItemCardActionsProps {
  discoverItemId: string;
  item: DiscoverItemDto | null;
  type?: DiscoverItemType;
}

const TRACKING_STATUSES = Object.values(TrackingStatus);

const TRACKING_LABELS: Record<
  (typeof TrackingStatus)[keyof typeof TrackingStatus],
  string
> = {
  [TrackingStatus.BACKLOG]: 'Backlog',
  [TrackingStatus.IN_PROGRESS]: 'In progress',
  [TrackingStatus.COMPLETED]: 'Completed',
  [TrackingStatus.DROPPED]: 'Dropped',
  [TrackingStatus.ON_HOLD]: 'On hold',
};

export function ItemCardActions({
  discoverItemId,
  item,
  type,
}: ItemCardActionsProps) {
  const queryClient = useQueryClient();

  const serverStatus = item?.trackingStatus ?? TrackingStatus.BACKLOG;
  const serverProgress = item?.progress ?? 0;
  const totalUnits = item?.totalUnits ?? null;
  const unitName = item?.unitName ?? null;
  const showProgress =
    (totalUnits != null && totalUnits > 0) ||
    (unitName != null && unitName.length > 0);

  const [localProgress, setLocalProgress] = useState(String(serverProgress));
  const debouncedProgress = useDebouncedValue(localProgress, 400);

  useEffect(() => {
    setLocalProgress(String(serverProgress));
  }, [serverProgress]);

  const updateTracking = useMutation({
    ...discoverMutations.updateTracking(discoverItemId),

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({
        queryKey: discoverKeys.detail(discoverItemId),
      });

      const previousItem = queryClient.getQueryData<DiscoverItemDto>(
        discoverKeys.detail(discoverItemId),
      );

      queryClient.setQueryData<DiscoverItemDto>(
        discoverKeys.detail(discoverItemId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            ...newVariables,
          };
        },
      );

      return { previousItem };
    },

    onError: (err, newVariables, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(
          discoverKeys.detail(discoverItemId),
          context.previousItem,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: discoverKeys.detail(discoverItemId),
      });

      if (type) {
        queryClient.invalidateQueries({ queryKey: discoverKeys.type(type) });
      }
    },
  });

  const commitProgress = (rawValue: string) => {
    const raw = parseInt(rawValue, 10);
    if (Number.isNaN(raw)) {
      setLocalProgress(String(serverProgress));

      return;
    }
    const clamped =
      totalUnits != null
        ? Math.min(totalUnits, Math.max(0, raw))
        : Math.max(0, raw);
    setLocalProgress(String(clamped));

    if (clamped !== serverProgress) {
      updateTracking.mutate({ progress: clamped });
    }
  };

  useEffect(() => {
    const raw = parseInt(debouncedProgress, 10);
    if (!Number.isNaN(raw) && raw !== serverProgress) {
      updateTracking.mutate({ progress: raw });
    }
  }, [debouncedProgress, serverProgress, updateTracking]);

  const handleProgressDelta = (delta: number) => {
    if (totalUnits == null) return;
    const current = parseInt(localProgress, 10) || 0;
    const next = Math.min(totalUnits, Math.max(0, current + delta));
    setLocalProgress(String(next));
  };

  const isPending = updateTracking.isPending;
  const displayProgress = parseInt(localProgress, 10) || 0;

  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      <div className="border-border/50 bg-background/50 flex flex-wrap items-end gap-6 rounded-xl border p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Lists
          </label>
          <AddToListButton discoverItemId={discoverItemId} />
        </div>

        <div className="bg-border/50 mt-auto mb-1 hidden h-8 w-px sm:block" />

        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Status
          </label>
          <Select
            value={serverStatus}
            onValueChange={(val) => {
              if (!val) return;
              updateTracking.mutate({ status: val as TrackingStatus });
            }}
          >
            <SelectTrigger
              className={cn(
                'bg-card hover:bg-muted/50 h-9 w-[160px] transition-colors',
                isPending && 'pointer-events-none opacity-70',
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRACKING_STATUSES.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="cursor-pointer"
                >
                  {TRACKING_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showProgress && (
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Progress
            </label>
            <div className="flex items-center gap-3">
              <div className="border-border/50 bg-card flex items-center gap-1 rounded-md border p-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 rounded-full"
                  onClick={() => handleProgressDelta(-1)}
                  disabled={displayProgress <= 0}
                >
                  <MinusIcon className="h-3.5 w-3.5" />
                </Button>

                <Input
                  type="number"
                  min={0}
                  max={totalUnits ?? undefined}
                  value={localProgress}
                  onChange={(e) => setLocalProgress(e.target.value)}
                  onBlur={(e) => commitProgress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      commitProgress(e.currentTarget.value);
                      e.currentTarget.blur();
                    }
                  }}
                  className="h-7 w-12 [appearance:textfield] border-none bg-transparent p-0 text-center text-sm font-bold focus-visible:ring-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 rounded-full"
                  onClick={() => handleProgressDelta(1)}
                  disabled={totalUnits == null || displayProgress >= totalUnits}
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                of {totalUnits ?? '?'} {unitName ?? ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
