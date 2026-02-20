import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/common';

type LabelProps = HTMLAttributes<HTMLSpanElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <span
      className={cn('text-foreground text-xs font-medium', className)}
      {...props}
    />
  );
}
