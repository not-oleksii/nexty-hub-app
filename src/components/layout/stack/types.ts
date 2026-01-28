import type { HTMLAttributes } from 'react';

type Space = 2 | 4 | 8 | 16 | 18 | 24 | 32;

type Align = 'start' | 'center' | 'end' | 'stretch';

type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

type Direction = 'row' | 'col';

type Wrap = 'nowrap' | 'wrap';

export type StackProps = HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string } & { 
  direction?: Direction;
  space?: Space;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
};
