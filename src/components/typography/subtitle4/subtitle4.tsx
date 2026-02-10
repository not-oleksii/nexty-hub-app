import { cn } from '@/utils/common';

import type { Subtitle4Props } from './types';

export function Subtitle4({ className, ...props }: Subtitle4Props) {
  return (
    <h5
      className={cn('text-xs font-medium tracking-wide uppercase', className)}
      {...props}
    />
  );
}
