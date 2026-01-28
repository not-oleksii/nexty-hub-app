import { cn } from '@/lib/utils';

import type { CardDescriptionProps } from './types';

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
