import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/common';

type OverlineProps = HTMLAttributes<HTMLSpanElement>;

export function Overline({ className, ...props }: OverlineProps) {
  return (
    <span
      className={cn(
        'text-muted-foreground text-[11px] font-medium tracking-widest uppercase',
        className,
      )}
      {...props}
    />
  );
}
