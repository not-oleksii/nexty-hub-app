import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type Subtitle1Props = HTMLAttributes<HTMLHeadingElement>;

export function Subtitle1({ className, ...props }: Subtitle1Props) {
  return <h2 className={cn('text-lg font-medium', className)} {...props} />;
}
