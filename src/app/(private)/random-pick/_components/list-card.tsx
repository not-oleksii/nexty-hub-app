import { useCallback, useMemo } from 'react';

import { CheckCircle2 } from 'lucide-react';

import { Caption1 } from '@/components/typography/caption1';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbnailStack } from '@/components/ui/thumbnail-stack';
import { cn } from '@/lib/utils/common';
import { UserListSummaryDto } from '@/server/api/lists';

interface ListCardProps {
  list: UserListSummaryDto;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (listId: string) => void;
}

export function ListCard({
  list,
  selected = false,
  disabled = false,
  onClick,
}: ListCardProps) {
  const {
    name,
    totalDiscoverItems,
    completedDiscoverItems,
    owner,
    discoverItems,
  } = list;

  const progressPercentage = useMemo(() => {
    if (totalDiscoverItems === 0) return 0;

    return Math.round((completedDiscoverItems / totalDiscoverItems) * 100);
  }, [totalDiscoverItems, completedDiscoverItems]);

  const isCompleted =
    totalDiscoverItems > 0 && completedDiscoverItems === totalDiscoverItems;

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick(list.id);
    }
  }, [onClick, disabled, list.id]);

  return (
    <Card
      onClick={handleClick}
      className={cn(
        'group relative flex h-full flex-col justify-between transition-all duration-300',
        !disabled &&
          'hover:border-primary/50 cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
        selected &&
          'border-primary bg-primary/5 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.15)]',
        disabled &&
          'cursor-not-allowed opacity-50 grayscale hover:translate-y-0',
      )}
    >
      {selected && (
        <div className="text-primary animate-in zoom-in absolute top-4 right-4 z-40 duration-300">
          <CheckCircle2 className="fill-primary/10 h-5 w-5" />
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <ThumbnailStack
            items={discoverItems.map((item) => ({
              id: item.id,
              title: item.title,
              imageUrl: item.imageUrl,
            }))}
          />

          <div className="flex flex-col gap-1 pt-1 pr-6">
            <CardTitle className="group-hover:text-primary line-clamp-1 text-base transition-colors duration-300">
              {name}
            </CardTitle>
            <Caption1 className="text-muted-foreground line-clamp-1">
              By {owner.username}
            </Caption1>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {totalDiscoverItems > 0 ? (
          <div className="flex flex-col gap-1.5">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {completedDiscoverItems} / {totalDiscoverItems} items
              </span>
              <span
                className={cn('font-medium', isCompleted && 'text-primary')}
              >
                {progressPercentage}%
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className={cn('h-1.5', isCompleted && '[&>div]:bg-primary')}
            />
          </div>
        ) : (
          <div className="flex h-[26px] items-center">
            <span className="text-muted-foreground text-xs">List is empty</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ListCardSkeleton() {
  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="flex w-full flex-col gap-2 pt-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
