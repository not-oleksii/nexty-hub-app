'use client';

import { type MouseEvent, useCallback, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, PlusIcon } from 'lucide-react';

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

import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

interface AddToListButtonProps {
  discoverItemId: string;
  iconOnly?: boolean;
}

export function AddToListButton({
  discoverItemId,
  iconOnly = false,
}: AddToListButtonProps) {
  const queryClient = useQueryClient();
  const listsWithSelectedDiscoverItem = useQuery(
    listsQueries.byDiscoverItemId(discoverItemId),
  );
  const allLists = useQuery(listsQueries.all());
  const addItemToList = useMutation(
    listsMutations.addOrRemoveDiscoverItemToList(),
  );

  const isSaved = Boolean(
    listsWithSelectedDiscoverItem.data?.some((list) =>
      list.discoverItems.some((item) => item.id === discoverItemId),
    ),
  );

  const handleAddItemToList = useCallback(
    async (listId?: string) => {
      try {
        await addItemToList.mutateAsync({ discoverItemId, listId });
        await queryClient.invalidateQueries({ queryKey: listsKeys.all });
      } catch (error) {
        console.error('Error adding item to list:', error);
      }
    },
    [addItemToList, discoverItemId, queryClient],
  );

  const handleButtonClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!allLists.data || allLists.data.length === 0) {
        handleAddItemToList();
      }
    },
    [allLists.data, handleAddItemToList],
  );

  const isLoading = allLists.isLoading || addItemToList.isPending;

  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <Spinner data-icon="inline" />;
    }

    if (iconOnly) {
      return isSaved ? (
        <BookmarkIcon className="h-4 w-4" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      );
    }

    return isSaved ? (
      <>
        <BookmarkIcon className="h-4 w-4" />
        Saved
      </>
    ) : (
      <>
        <PlusIcon className="h-4 w-4" />
        Add To List
      </>
    );
  }, [isSaved, isLoading, iconOnly]);

  if (!allLists.data || allLists.data.length === 0) {
    return (
      <Button
        variant={isSaved ? 'default' : 'secondary'}
        size={iconOnly ? 'icon' : 'default'}
        disabled={isLoading}
        onClick={handleButtonClick}
        aria-label={isSaved ? 'Saved to list' : 'Add to list'}
      >
        {buttonContent}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isSaved ? 'default' : 'secondary'}
          size={iconOnly ? 'icon' : 'default'}
          disabled={isLoading}
          onClick={handleButtonClick}
          aria-label={isSaved ? 'Saved to list' : 'Add to list'}
        >
          {buttonContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allLists.data?.map((list) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={list.id}
            onSelect={(event) => {
              event.preventDefault();
              handleAddItemToList(list.id);
            }}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(
                  list.discoverItems.some((item) => item.id === discoverItemId),
                )}
                className="pointer-events-none"
              />
              <span>{list.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
