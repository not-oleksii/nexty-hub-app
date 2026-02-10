import { cn } from '@/utils/common';

import type { OverlineProps } from './types';

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
