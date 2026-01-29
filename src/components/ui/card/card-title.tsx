import { cn } from '@/lib/utils';

import type { CardTitleProps } from './types';

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-2xl leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}
