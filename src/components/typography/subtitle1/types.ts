import type { HTMLAttributes } from 'react';

export type SubtitleProps = HTMLAttributes<HTMLHeadingElement> & {
  size?: 1 | 2 | 3 | 4;
};

export type Subtitle1Props = SubtitleProps;
