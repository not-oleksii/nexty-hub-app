import { useCallback } from 'react';

import { Caption1 } from '@/components/typography/caption1';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
  const { name, totalDiscoverItems, owner } = list;

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick(list.id);
    }
  }, [onClick, disabled, list.id]);

  return (
    <Card
      onClick={handleClick}
      className={cn(
        selected && 'bg-primary/60',
        disabled && 'opacity-50',
        !disabled && 'border-primary/10 cursor-pointer',
      )}
    >
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>{name}</CardTitle>
          <Caption1>By {owner.username}</Caption1>
        </div>
      </CardHeader>
      <CardContent>
        {totalDiscoverItems > 0 && (
          <Caption1>Total items: {totalDiscoverItems}</Caption1>
        )}
        {totalDiscoverItems === 0 && <Caption1>No items in this list</Caption1>}
      </CardContent>
    </Card>
  );
}

export function ListCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-30" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}
