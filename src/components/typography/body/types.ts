import type { HTMLAttributes } from 'react';

export type BodyProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: 'default' | 'muted';
};
