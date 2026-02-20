import { cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/common';

type CaptionSize = 'base' | 'sm' | 'xs';

type CaptionProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: CaptionSize;
};

const captionVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      base: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export function Caption({ className, size = 'sm', ...props }: CaptionProps) {
  return <p className={cn(captionVariants({ size }), className)} {...props} />;
}
