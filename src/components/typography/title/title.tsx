import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type TitleProps = HTMLAttributes<HTMLHeadingElement>;

export function Title({ className, ...props }: TitleProps) {
  return <h1 className={cn('text-2xl font-semibold tracking-tight', className)} {...props} />;
}
