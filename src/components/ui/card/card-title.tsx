import { cn } from '@/lib/utils';

import type { CardTitleProps } from './types';

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />;
}
