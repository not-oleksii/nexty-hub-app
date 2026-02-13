import { DiscoverItemType } from '@generated/prisma/enums';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { discoverApi } from '../discover';

export const discoverKeys = {
  all: ['discover'] as const,
  lists: () => [...discoverKeys.all, 'list'] as const,
  type: (type: DiscoverItemType) =>
    [...discoverKeys.all, 'type', type] as const,
  detail: (id: string) => [...discoverKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...discoverKeys.all, 'create'] as const,
  },
};

export const discoverQueries = {
  all: () =>
    queryOptions({
      queryKey: discoverKeys.lists(),
      queryFn: discoverApi.getAll,
    }),

  type: (type: DiscoverItemType) =>
    queryOptions({
      queryKey: discoverKeys.type(type),
      queryFn: () => discoverApi.getByType(type),
    }),

  detail: (type: DiscoverItemType, id: string) =>
    queryOptions({
      queryKey: discoverKeys.detail(id),
      queryFn: () => discoverApi.getById(id),
    }),
};

export const discoverMutations = {
  create: () =>
    mutationOptions({
      mutationKey: discoverKeys.mutations.create(),
      mutationFn: discoverApi.create,
    }),
};
