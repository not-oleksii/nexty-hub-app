import { cn } from '@/utils/common';

import type { Caption2Props } from './types';

export function Caption2({ className, ...props }: Caption2Props) {
  return (
    <p className={cn('text-muted-foreground text-xs', className)} {...props} />
  );
}
