import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type Caption1Props = HTMLAttributes<HTMLParagraphElement>;

export function Caption1({ className, ...props }: Caption1Props) {
  return <p className={cn('text-xs text-muted-foreground', className)} {...props} />;
}
