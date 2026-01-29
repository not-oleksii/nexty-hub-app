import { cn } from '@/lib/utils';

import type { CardProps } from './types';

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-xl border shadow',
        className,
      )}
      {...props}
    />
  );
}
