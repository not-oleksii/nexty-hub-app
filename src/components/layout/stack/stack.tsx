import { cn } from '@/lib/utils';

import type { StackProps } from './types';

const directionClass: Record<NonNullable<StackProps['direction']>, string> = {
  row: 'flex-row',
  col: 'flex-col',
};

const alignClass: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClass: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const wrapClass: Record<NonNullable<StackProps['wrap']>, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
};

// Tailwind spacing scale mapping.
// Note: Tailwind default spacing uses 4.5rem for 18 => gap-18 should work.
const gapClass: Record<NonNullable<StackProps['space']>, string> = {
  2: 'gap-2',
  4: 'gap-4',
  8: 'gap-8',
  16: 'gap-16',
  18: 'gap-18',
  24: 'gap-24',
  32: 'gap-32',
};

export function Stack({
  className,
  direction = 'col',
  space = 8,
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        directionClass[direction],
        gapClass[space],
        alignClass[align],
        justifyClass[justify],
        wrapClass[wrap],
        className,
      )}
      {...props}
    />
  );
}
