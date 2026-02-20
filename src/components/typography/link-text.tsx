import type { AnchorHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/common';

type LinkTextProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function LinkText({ className, ...props }: LinkTextProps) {
  return (
    <a
      className={cn(
        'text-primary focus-visible:ring-ring underline underline-offset-4 hover:opacity-90 focus-visible:ring-1 focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
}
