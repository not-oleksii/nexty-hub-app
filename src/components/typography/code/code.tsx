import { cn } from '@/lib/utils';

import type { CodeProps } from './types';

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        [
          'bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs',
          'border-border border',
        ].join(' '),
        className,
      )}
      {...props}
    />
  );
}
