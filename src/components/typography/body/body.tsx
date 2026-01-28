import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type BodyProps = HTMLAttributes<HTMLParagraphElement>;

export function Body({ className, ...props }: BodyProps) {
  return <p className={cn('text-sm text-foreground', className)} {...props} />;
}
