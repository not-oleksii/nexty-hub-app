import { cn } from '@/lib/utils';

import type { Caption1Props } from './types';

export function Caption1({ className, ...props }: Caption1Props) {
  return (
    <p className={cn('text-muted-foreground text-xs', className)} {...props} />
  );
}
