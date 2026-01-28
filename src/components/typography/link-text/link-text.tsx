import { cn } from '@/lib/utils';

import type { LinkTextProps } from './types';

export function LinkText({ className, ...props }: LinkTextProps) {
  return (
    <a
      className={cn(
        'text-primary underline underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}
