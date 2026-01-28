import { cn } from '@/lib/utils';

import type { CodeProps } from './types';

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        [
          'rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground',
          'border border-border',
        ].join(' '),
        className,
      )}
      {...props}
    />
  );
}
