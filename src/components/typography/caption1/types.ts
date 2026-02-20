import type { HTMLAttributes } from 'react';

export type CaptionProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: 1 | 2;
};

export type Caption1Props = CaptionProps;
