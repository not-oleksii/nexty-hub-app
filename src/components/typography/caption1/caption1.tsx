import { cn } from '@/utils/common';

import type { Caption1Props } from './types';

export function Caption1({ className, ...props }: Caption1Props) {
  return (
    <p className={cn('text-muted-foreground text-s', className)} {...props} />
  );
}
