import { cn } from '@/lib/utils';

import type { ContentProps } from './types';

export function ContentWrapper({ className, ...props }: ContentProps) {
  // NOTE: This is a layout wrapper, not the document <main>.
  // Keep semantics in the page/layout components.
  return <div className={cn('w-full p-6', className)} {...props} />;
}
