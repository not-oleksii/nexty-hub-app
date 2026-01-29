import { cn } from '@/lib/utils';

import type { CardDescriptionProps } from './types';

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props} />
  );
}
