import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type Subtitle2Props = HTMLAttributes<HTMLHeadingElement>;

export function Subtitle2({ className, ...props }: Subtitle2Props) {
  return <h3 className={cn('text-base font-medium', className)} {...props} />;
}
