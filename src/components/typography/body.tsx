import type { HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/common';

type BodySize = 'base' | 'sm';

type BodyProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: 'default' | 'muted';
  size?: BodySize;
};

const bodyVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    },
    size: {
      base: 'text-base',
      sm: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});

export function Body({
  className,
  variant = 'default',
  size = 'sm',
  ...props
}: BodyProps) {
  return (
    <p className={cn(bodyVariants({ variant, size }), className)} {...props} />
  );
}
