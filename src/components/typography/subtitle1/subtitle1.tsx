import { cn } from '@/lib/utils/common';

import type { Subtitle1Props } from './types';

export function Subtitle1({ className, ...props }: Subtitle1Props) {
  return <h2 className={cn('text-lg font-medium', className)} {...props} />;
}
