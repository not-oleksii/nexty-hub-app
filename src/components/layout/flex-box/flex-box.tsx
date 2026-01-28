import { cn } from '@/lib/utils';

import type { FlexBoxProps } from './types';

const directionClass: Record<NonNullable<FlexBoxProps['direction']>, string> = {
  row: 'flex-row',
  col: 'flex-col',
};

const alignClass: Record<NonNullable<FlexBoxProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClass: Record<NonNullable<FlexBoxProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const gapClass: Record<NonNullable<FlexBoxProps['gap']>, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export function FlexBox({
  className,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 'none',
  ...props
}: FlexBoxProps) {
  return (
    <div
      className={cn('flex', directionClass[direction], alignClass[align], justifyClass[justify], gapClass[gap], className)}
      {...props}
    />
  );
}
