import type { HTMLAttributes } from 'react';

type Space = 2 | 4 | 8 | 16 | 18 | 24 | 32;

export type SpacerProps = HTMLAttributes<HTMLDivElement> & {
  size?: Space;
  axis?: 'x' | 'y';
};
