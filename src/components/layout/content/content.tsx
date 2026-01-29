import { cn } from '@/lib/utils';

import type { ContentProps } from './types';

export function ContentWrapper({ className, ...props }: ContentProps) {
  return (
    <main className={cn('mx-auto w-full max-w-xl p-6', className)} {...props} />
  );
}
