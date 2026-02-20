import type { HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/common';

type HeaderSize = 'xl' | 'lg';

type HeaderProps = HTMLAttributes<HTMLHeadingElement> & {
  size?: HeaderSize;
};

const headerVariants = cva('font-semibold tracking-tight', {
  variants: {
    size: {
      xl: 'text-3xl',
      lg: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

const headerElements = {
  xl: 'h1',
  lg: 'h2',
} as const;

export function Header({ className, size = 'xl', ...props }: HeaderProps) {
  const Component = headerElements[size];

  return (
    <Component className={cn(headerVariants({ size }), className)} {...props} />
  );
}
