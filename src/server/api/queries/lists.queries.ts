import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { addDiscoverItemToList, getUserLists } from '../lists';

export const listsKeys = {
  all: ['lists'] as const,
  lists: () => [...listsKeys.all] as const,
  byItem: (itemId: string) => [...listsKeys.lists(), 'item', itemId] as const,
  mutations: {
    addDiscoverItemToList: () =>
      [...listsKeys.all, 'addDiscoverItemToList'] as const,
  },
};

export const listsQueries = {
  all: () =>
    queryOptions({
      queryKey: listsKeys.lists(),
      queryFn: () => getUserLists(),
    }),
  byItem: (itemId: string) =>
    queryOptions({
      queryKey: listsKeys.byItem(itemId),
      queryFn: () => getUserLists(itemId),
    }),
};

export const listsMutations = {
  addDiscoverItemToList: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.addDiscoverItemToList(),
      mutationFn: addDiscoverItemToList,
    }),
};
