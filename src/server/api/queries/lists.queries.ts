import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { listsApi } from '../lists';

export const listsKeys = {
  all: ['lists'] as const,
  getAll: () => [...listsKeys.all] as const,
  byDiscoverItemId: (discoverItemId: string) =>
    [...listsKeys.all, 'item', discoverItemId] as const,
  mutations: {
    addOrRemoveDiscoverItemToList: () =>
      [...listsKeys.all, 'addOrRemoveDiscoverItemToList'] as const,
    create: () => [...listsKeys.all, 'create'] as const,
  },
};

export const listsQueries = {
  all: () =>
    queryOptions({
      queryKey: listsKeys.getAll(),
      queryFn: listsApi.getAll,
    }),
  byDiscoverItemId: (discoverItemId: string) =>
    queryOptions({
      queryKey: listsKeys.byDiscoverItemId(discoverItemId),
      queryFn: () => listsApi.getByDiscoverItemId(discoverItemId),
    }),
};

export const listsMutations = {
  addOrRemoveDiscoverItemToList: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.addOrRemoveDiscoverItemToList(),
      mutationFn: listsApi.addOrRemoveDiscoverItemToList,
    }),
  create: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.create(),
      mutationFn: listsApi.create,
    }),
};
