import { cn } from '@/lib/utils/common';

import type { CodeProps } from './types';

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        `bg-muted text-foreground \ border-border rounded border px-1.5 py-0.5 font-mono text-xs`,
        className,
      )}
      {...props}
    />
  );
}
