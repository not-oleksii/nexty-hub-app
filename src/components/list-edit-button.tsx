'use client';

import Link from 'next/link';

import { Edit2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/common';

type ListEditButtonProps = {
  listId: string;
  className?: string;
  variant?: 'overlay' | 'static';
};

export function ListEditButton({
  listId,
  className,
  variant = 'static',
}: ListEditButtonProps) {
  const isOverlay = variant === 'overlay';

  return (
    <Link
      href={ROUTES.lists.edit(listId)}
      className={cn(
        'absolute top-4 right-4 z-10',
        isOverlay && 'top-3 right-3',
        className,
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          'bg-background/80 hover:bg-background shadow-md backdrop-blur-sm',
          isOverlay &&
            'bg-background/60 hover:bg-background/90 h-8 w-8 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 hover:scale-105',
        )}
      >
        <Edit2Icon className="text-foreground h-4 w-4" />
      </Button>
    </Link>
  );
}
