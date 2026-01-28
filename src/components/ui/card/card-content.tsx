import { cn } from '@/lib/utils';

import type { CardContentProps } from './types';

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}
