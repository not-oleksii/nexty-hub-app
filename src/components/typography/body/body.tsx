import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/common';

import type { BodyProps } from './types';

const bodyVariants = cva('text-sm', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Body({ className, variant = 'default', ...props }: BodyProps) {
  return <p className={cn(bodyVariants({ variant }), className)} {...props} />;
}
