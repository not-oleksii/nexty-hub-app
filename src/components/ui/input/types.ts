import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  'data-testid'?: string;
};
