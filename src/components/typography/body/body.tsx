import { cn } from '@/lib/utils';

import type { BodyProps } from './types';

export function Body({ className, ...props }: BodyProps) {
  return <p className={cn('text-foreground text-sm', className)} {...props} />;
}
