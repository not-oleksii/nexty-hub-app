import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type Caption2Props = HTMLAttributes<HTMLParagraphElement>;

export function Caption2({ className, ...props }: Caption2Props) {
  return <p className={cn('text-[11px] text-muted-foreground', className)} {...props} />;
}
