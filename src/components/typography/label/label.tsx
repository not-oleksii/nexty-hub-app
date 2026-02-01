import { cn } from '@/lib/utils';

import type { LabelProps } from './types';

export function Label({ className, ...props }: LabelProps) {
  return (
    <span
      className={cn('text-foreground text-xs font-medium', className)}
      {...props}
    />
  );
}
