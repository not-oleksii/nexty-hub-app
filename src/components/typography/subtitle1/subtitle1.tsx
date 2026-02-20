import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/common';

import type { SubtitleProps } from './types';

const subtitleVariants = cva('font-medium', {
  variants: {
    size: {
      1: 'text-lg',
      2: 'text-base',
      3: 'text-sm',
      4: 'text-xs tracking-wide uppercase',
    },
  },
});

const subtitleElements = {
  1: 'h2',
  2: 'h3',
  3: 'h4',
  4: 'h5',
} as const;

export function Subtitle1({ className, size = 1, ...props }: SubtitleProps) {
  const Component = subtitleElements[size];
  return (
    <Component
      className={cn(subtitleVariants({ size }), className)}
      {...props}
    />
  );
}
