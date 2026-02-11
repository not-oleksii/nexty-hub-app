import { cn } from '@/lib/utils/common';

import type { ContentProps } from './types';

export function ContentWrapper({ className, ...props }: ContentProps) {
  return <div className={cn('w-full p-6', className)} {...props} />;
}
