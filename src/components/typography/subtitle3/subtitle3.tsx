import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type Subtitle3Props = HTMLAttributes<HTMLHeadingElement>;

export function Subtitle3({ className, ...props }: Subtitle3Props) {
  return <h4 className={cn('text-sm font-medium', className)} {...props} />;
}
