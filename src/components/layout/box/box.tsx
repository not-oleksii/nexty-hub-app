import { cn } from '@/lib/utils';

import type { BoxProps } from './types';

export function Box({ className, ...props }: BoxProps) {
  return <div className={cn(className)} {...props} />;
}
