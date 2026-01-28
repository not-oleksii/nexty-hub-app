import { cn } from '@/lib/utils';

import type { Caption2Props } from './types';

export function Caption2({ className, ...props }: Caption2Props) {
  return <p className={cn('text-[11px] text-muted-foreground', className)} {...props} />;
}
