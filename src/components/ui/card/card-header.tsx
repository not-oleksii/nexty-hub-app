import { cn } from '@/lib/utils';

import type { CardHeaderProps } from './types';

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
}
