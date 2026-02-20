import { cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/common';

type SubtitleSize = 'lg' | 'base' | 'sm' | 'xs';

type SubtitleProps = HTMLAttributes<HTMLHeadingElement> & {
  size?: SubtitleSize;
};

const subtitleVariants = cva('font-medium', {
  variants: {
    size: {
      lg: 'text-lg',
      base: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs tracking-wide uppercase',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

const subtitleElements = {
  lg: 'h2',
  base: 'h3',
  sm: 'h4',
  xs: 'h5',
} as const;

export function Subtitle({ className, size = 'lg', ...props }: SubtitleProps) {
  const Component = subtitleElements[size];

  return (
    <Component
      className={cn(subtitleVariants({ size }), className)}
      {...props}
    />
  );
}
