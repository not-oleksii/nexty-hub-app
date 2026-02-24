'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/common';

type ListTagsBadgesProps = {
  tags: string[];
  maxDisplay?: number;
  size?: 'sm' | 'md';
  className?: string;
};

export function ListTagsBadges({
  tags,
  maxDisplay,
  size = 'sm',
  className,
}: ListTagsBadgesProps) {
  const badgeSize = size === 'sm' ? 'text-[11px]' : 'text-xs';

  if (tags.length === 0) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'border-muted-foreground/20 text-muted-foreground/40 border-dashed font-normal',
          badgeSize,
          className,
        )}
      >
        No tags
      </Badge>
    );
  }

  const displayedTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay ? Math.max(0, tags.length - maxDisplay) : 0;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {displayedTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn('bg-muted/50 hover:bg-muted font-normal', badgeSize)}
        >
          #{tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="secondary"
          className={cn('bg-muted/50 hover:bg-muted font-normal', badgeSize)}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
