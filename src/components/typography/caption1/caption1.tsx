import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/common';

import type { CaptionProps } from './types';

const captionVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      1: 'text-sm',
      2: 'text-xs',
    },
  },
  defaultVariants: {
    size: 1,
  },
});

export function Caption1({ className, size = 1, ...props }: CaptionProps) {
  return <p className={cn(captionVariants({ size }), className)} {...props} />;
}
