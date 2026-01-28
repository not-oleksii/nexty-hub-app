import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type LabelProps = HTMLAttributes<HTMLSpanElement>;

export function Label({ className, ...props }: LabelProps) {
  return <span className={cn('text-xs font-medium text-foreground', className)} {...props} />;
}
