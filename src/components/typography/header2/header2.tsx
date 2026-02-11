import { cn } from '@/lib/utils/common';

import type { Header2Props } from './types';

export function Header2({ className, ...props }: Header2Props) {
  return (
    <h2
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}
