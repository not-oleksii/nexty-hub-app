import { cn } from '@/utils/common';

import type { Subtitle2Props } from './types';

export function Subtitle2({ className, ...props }: Subtitle2Props) {
  return <h3 className={cn('text-base font-medium', className)} {...props} />;
}
