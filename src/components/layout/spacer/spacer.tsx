import { cn } from '@/lib/utils';

import type { SpacerProps } from './types';

const sizeClass: Record<NonNullable<SpacerProps['size']>, string> = {
  2: 'w-2 h-2',
  4: 'w-4 h-4',
  8: 'w-8 h-8',
  16: 'w-16 h-16',
  18: 'w-18 h-18',
  24: 'w-24 h-24',
  32: 'w-32 h-32',
};

const axisClass: Record<NonNullable<SpacerProps['axis']>, string> = {
  x: 'h-0',
  y: 'w-0',
};

export function Spacer({ className, size = 8, axis = 'y', ...props }: SpacerProps) {
  return <div className={cn(sizeClass[size], axisClass[axis], className)} aria-hidden {...props} />;
}
