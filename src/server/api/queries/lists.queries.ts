import { mutationOptions, queryOptions } from '@tanstack/react-query';

import type { ListSchema } from '@/lib/validators/list';

import { listsApi } from '../lists';

export const listsKeys = {
  all: ['lists'] as const,
  getAll: () => [...listsKeys.all] as const,
  public: () => [...listsKeys.all, 'public'] as const,
  saved: () => [...listsKeys.all, 'saved'] as const,
  detail: (id: string) => [...listsKeys.all, 'detail', id] as const,
  view: (id: string) => [...listsKeys.all, 'view', id] as const,
  byDiscoverItemId: (discoverItemId: string) =>
    [...listsKeys.all, 'item', discoverItemId] as const,
  mutations: {
    addOrRemoveDiscoverItemToList: () =>
      [...listsKeys.all, 'addOrRemoveDiscoverItemToList'] as const,
    create: () => [...listsKeys.all, 'create'] as const,
    update: () => [...listsKeys.all, 'update'] as const,
    delete: () => [...listsKeys.all, 'delete'] as const,
    save: () => [...listsKeys.all, 'save'] as const,
    unsave: () => [...listsKeys.all, 'unsave'] as const,
  },
};

export const listsQueries = {
  all: () =>
    queryOptions({
      queryKey: listsKeys.getAll(),
      queryFn: listsApi.getAll,
    }),
  public: () =>
    queryOptions({
      queryKey: listsKeys.public(),
      queryFn: listsApi.getPublic,
    }),
  saved: () =>
    queryOptions({
      queryKey: listsKeys.saved(),
      queryFn: listsApi.getSaved,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: listsKeys.detail(id),
      queryFn: () => listsApi.getById(id),
    }),
  view: (id: string) =>
    queryOptions({
      queryKey: listsKeys.view(id),
      queryFn: () => listsApi.getViewById(id),
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
  update: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.update(),
      mutationFn: ({ id, ...payload }: { id: string } & ListSchema) =>
        listsApi.update(id, payload),
    }),
  delete: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.delete(),
      mutationFn: listsApi.delete,
    }),
  save: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.save(),
      mutationFn: listsApi.save,
    }),
  unsave: () =>
    mutationOptions({
      mutationKey: listsKeys.mutations.unsave(),
      mutationFn: listsApi.unsave,
    }),
};
