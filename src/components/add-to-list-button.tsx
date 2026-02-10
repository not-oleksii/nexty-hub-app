'use client';

import { type MouseEvent, useCallback } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  listsKeys,
  listsMutations,
  listsQueries,
} from '@/server/api/queries/lists.queries';

interface AddToListButtonProps {
  itemId: string;
}

export function AddToListButton({ itemId }: AddToListButtonProps) {
  const queryClient = useQueryClient();
  const { data: lists = [], isLoading } = useQuery(listsQueries.byItem(itemId));
  const { mutateAsync, isPending } = useMutation(
    listsMutations.addDiscoverItemToList(),
  );
  const isSaved = lists.some((list) => list.hasItems);

  const handleUpdateLists = useCallback(
    async (listIds?: string[]) => {
      try {
        await mutateAsync({ itemId, listIds });
        await queryClient.invalidateQueries({ queryKey: listsKeys.all });
      } catch (error) {
        console.error('Error adding item to list:', error);
      }
    },
    [itemId, mutateAsync, queryClient],
  );

  const handleButtonClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleQuickAdd = useCallback(
    async (event: MouseEvent) => {
      handleButtonClick(event);

      await handleUpdateLists();
    },
    [handleButtonClick, handleUpdateLists],
  );

  const getSelectedListIds = useCallback(
    () => lists.filter((list) => list.hasItems).map((list) => list.id),
    [lists],
  );

  const handleToggleList = useCallback(
    (listId: string, checked: boolean | 'indeterminate') => {
      const selectedIds = getSelectedListIds();
      const nextIds = Boolean(checked)
        ? Array.from(new Set([...selectedIds, listId]))
        : selectedIds.filter((id) => id !== listId);

      void handleUpdateLists(nextIds);
    },
    [getSelectedListIds, handleUpdateLists],
  );

  if (lists.length === 0) {
    return (
      <Button
        variant="secondary"
        disabled={isLoading || isPending}
        onClick={handleQuickAdd}
      >
        <PlusIcon className="h-4 w-4" />
        Add To List
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isSaved ? 'default' : 'secondary'}
          disabled={isLoading || isPending}
          onClick={handleButtonClick}
        >
          {isSaved ? (
            <>
              <BookmarkIcon className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4" />
              Add To List
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {lists.map((list) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={list.id}
            // eslint-disable-next-line react/jsx-no-bind
            onSelect={(event) => {
              event.preventDefault();
              handleToggleList(list.id, !list.hasItems);
            }}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(list.hasItems)}
                className="pointer-events-none"
                // eslint-disable-next-line react/jsx-no-bind
                onCheckedChange={(checked) => {
                  handleToggleList(list.id, checked);
                }}
              />
              <span>{list.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
