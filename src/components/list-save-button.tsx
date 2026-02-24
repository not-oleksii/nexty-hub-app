'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkCheckIcon, BookmarkIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils/common';
import { listsKeys, listsMutations } from '@/server/api/queries/lists.queries';

type ListSaveButtonProps = {
  listId: string;
  isSaved: boolean;
  className?: string;
  variant?: 'overlay' | 'static';
};

export function ListSaveButton({
  listId,
  isSaved,
  className,
  variant = 'overlay',
}: ListSaveButtonProps) {
  const queryClient = useQueryClient();
  const isOverlay = variant === 'overlay';

  const saveMutation = useMutation({
    ...listsMutations.save(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listsKeys.public() });
      queryClient.invalidateQueries({ queryKey: listsKeys.saved() });
      toast.success('List saved');
    },
    onError: () => {
      toast.error('Failed to save list');
    },
  });

  const unsaveMutation = useMutation({
    ...listsMutations.unsave(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listsKeys.public() });
      queryClient.invalidateQueries({ queryKey: listsKeys.saved() });
      toast.success('List removed from saved');
    },
    onError: () => {
      toast.error('Failed to unsave list');
    },
  });

  const isLoading = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading) return;

    if (isSaved) {
      unsaveMutation.mutate(listId);

      return;
    }

    saveMutation.mutate(listId);
  };

  return (
    <div
      className={cn(
        'absolute top-4 right-4 z-10',
        isOverlay && 'top-3 right-3',
        className,
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'bg-background/80 hover:bg-background shadow-md backdrop-blur-sm',
          isOverlay &&
            'bg-background/60 hover:bg-background/90 h-8 w-8 shadow-sm transition-all duration-300 hover:scale-105',
          isOverlay && !isSaved && 'opacity-0 group-hover:opacity-100',
        )}
      >
        {isLoading ? (
          <Spinner />
        ) : isSaved ? (
          <BookmarkCheckIcon className="text-primary h-4 w-4" />
        ) : (
          <BookmarkIcon className="text-foreground h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
