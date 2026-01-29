import { cn } from '@/lib/utils';

import type { TextareaProps } from './types';

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        `border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
        className,
      )}
      {...props}
    />
  );
}
