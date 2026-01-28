import { cn } from '@/lib/utils';

import type { CardProps } from './types';

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn('rounded-xl border bg-card text-card-foreground shadow', className)} {...props} />
  );
}
