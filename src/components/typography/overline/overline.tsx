import { cn } from '@/lib/utils';

import type { OverlineProps } from './types';

export function Overline({ className, ...props }: OverlineProps) {
  return <span className={cn('text-[11px] font-medium uppercase tracking-widest text-muted-foreground', className)} {...props} />;
}
