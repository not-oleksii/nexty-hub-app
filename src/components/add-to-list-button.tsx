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

interface AddToListButtonProps {
  discoverItemId: string;
}

interface AddToListButtonContentProps {
  isSaved: boolean;
  isLoading: boolean;
  onClick: (event: MouseEvent) => void;
  children?: React.ReactNode;
}

export function AddToListButton({ discoverItemId }: AddToListButtonProps) {
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

  const buttonContent = useMemo(() => {
    return (
      <>
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
      </>
    );
  }, [isSaved]);

  if (!allLists.data || allLists.data.length === 0) {
    return (
      <Button
        variant={isSaved ? 'default' : 'secondary'}
        disabled={allLists.isLoading || addItemToList.isPending}
        onClick={handleButtonClick}
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
          disabled={allLists.isLoading || addItemToList.isPending}
          onClick={handleButtonClick}
        >
          {buttonContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allLists.data?.map((list) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={list.id}
            // eslint-disable-next-line react/jsx-no-bind
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
