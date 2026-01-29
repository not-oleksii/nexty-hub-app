import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

import type { DropdownMenuItemProps } from './types';

export function DropdownMenuItem({
  className,
  inset,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        `focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  );
}
