import type { HTMLAttributes } from 'react';

export type FlexBoxProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
};
