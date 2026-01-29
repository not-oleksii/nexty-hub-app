import type { ButtonHTMLAttributes } from 'react';

type ButtonVariants =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive';
type ButtonSizes = 'default' | 'sm' | 'lg' | 'icon';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariants;
  size?: ButtonSizes;
};
