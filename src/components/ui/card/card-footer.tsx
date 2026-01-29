import { cn } from '@/lib/utils';

import type { CardFooterProps } from './types';

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
  );
}
