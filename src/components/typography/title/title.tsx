import { cn } from '@/utils/common';

import type { TitleProps } from './types';

export function Title({ className, ...props }: TitleProps) {
  return (
    <h1
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}
