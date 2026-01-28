import { cn } from '@/lib/utils';

import type { BodyProps } from './types';

export function Body({ className, ...props }: BodyProps) {
  return <p className={cn('text-sm text-foreground', className)} {...props} />;
}
