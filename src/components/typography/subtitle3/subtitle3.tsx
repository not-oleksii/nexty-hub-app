import { cn } from '@/lib/utils';

import type { Subtitle3Props } from './types';

export function Subtitle3({ className, ...props }: Subtitle3Props) {
  return <h4 className={cn('text-sm font-medium', className)} {...props} />;
}
