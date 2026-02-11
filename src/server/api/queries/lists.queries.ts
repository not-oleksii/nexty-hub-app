import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { listsApi } from '../lists';

export const listsKeys = {
  all: ['lists'] as const,
  lists: () => [...listsKeys.all] as const,
  byItem: (itemId: string) => [...listsKeys.lists(), 'item', itemId] as const,
  overview: () => [...listsKeys.lists(), 'overview'] as const,
  mutations: {
    addDiscoverItemToList: () =>
      [...listsKeys.all, 'addDiscoverItemToList'] as const,
  },
};

export const listsQueries = {
  overview: () =>
    queryOptions({
      queryKey: listsKeys.overview(),
      queryFn: listsApi.getOverview,
    }),
  byItem: (itemId: string) =>
    queryOptions({
      queryKey: listsKeys.byItem(itemId),
      queryFn: () => listsApi.getById(itemId),
    }),
};

export const listsMutations = {
  addDiscoverItemToList: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.addDiscoverItemToList(),
      mutationFn: listsApi.addOrRemoveDiscoverItemToList,
    }),
};
