'use client';

import { UsersIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/common';

type Member = { id: string; username: string };

type ListMembersBadgesProps = {
  members: Member[];
  maxDisplay?: number;
  emptyLabel?: string;
  prefix?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
};

export function ListMembersBadges({
  members,
  maxDisplay,
  emptyLabel = 'Only you',
  prefix,
  size = 'sm',
  className,
}: ListMembersBadgesProps) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const badgeSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const gap = size === 'sm' ? 'gap-1.5' : 'gap-2';

  return (
    <div className={cn('flex flex-wrap items-center', gap, className)}>
      <UsersIcon
        className={cn('text-muted-foreground/50 mr-1 shrink-0', iconSize)}
      />
      {prefix}
      {members.length > 0 ? (
        <>
          {(maxDisplay ? members.slice(0, maxDisplay) : members).map((m) => (
            <Badge
              key={m.id}
              variant="outline"
              className={cn(
                'text-muted-foreground font-medium tracking-wider uppercase',
                badgeSize,
              )}
            >
              {m.username}
            </Badge>
          ))}
          {maxDisplay && members.length > maxDisplay && (
            <Badge
              variant="outline"
              className={cn('text-muted-foreground font-medium', badgeSize)}
            >
              +{members.length - maxDisplay}
            </Badge>
          )}
        </>
      ) : (
        <Badge
          variant="outline"
          className={cn(
            'border-muted-foreground/20 text-muted-foreground/40 border-dashed font-medium tracking-wider uppercase',
            badgeSize,
          )}
        >
          {emptyLabel}
        </Badge>
      )}
    </div>
  );
}
