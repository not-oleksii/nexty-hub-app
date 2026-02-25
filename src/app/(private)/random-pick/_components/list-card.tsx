import { useCallback, useMemo } from 'react';

import { CheckCircle2 } from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
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
      variant="interactive"
      onClick={handleClick}
      className={cn(
        'relative flex h-full flex-col justify-between',
        !disabled && 'cursor-pointer',
        selected &&
          'border-primary bg-primary/5 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.15)]',
        disabled && 'cursor-not-allowed opacity-50 hover:translate-y-0',
      )}
    >
      {selected && (
        <div className="text-primary animate-entrance-zoom absolute top-4 right-4 z-40">
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
            <CardTitle
              className={cn(
                'group-hover-primary-transition line-clamp-1 text-base',
                disabled && 'group-hover:text-muted-foreground',
              )}
            >
              {name}
            </CardTitle>
            <Caption className="text-muted-foreground line-clamp-1">
              By {owner.username}
            </Caption>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {totalDiscoverItems > 0 ? (
          <div className="flex flex-col gap-1.5">
            <div className="text-muted-foreground flex items-center justify-between">
              <Body>
                {completedDiscoverItems} / {totalDiscoverItems} items
              </Body>
              <Body
                className={cn('font-medium', isCompleted && 'text-primary')}
              >
                {progressPercentage}%
              </Body>
            </div>
            <Progress value={progressPercentage} />
          </div>
        ) : (
          <div className="flex h-[26px] items-center">
            <Body variant="muted">List is empty</Body>
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
