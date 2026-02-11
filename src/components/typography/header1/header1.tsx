import { cn } from '@/lib/utils/common';

import type { Header1Props } from './types';

export function Header1({ className, ...props }: Header1Props) {
  return (
    <h1
      className={cn('text-3xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}
