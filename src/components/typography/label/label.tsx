import { cn } from '@/lib/utils';

import type { LabelProps } from './types';

export function Label({ className, ...props }: LabelProps) {
  return <span className={cn('text-xs font-medium text-foreground', className)} {...props} />;
}
