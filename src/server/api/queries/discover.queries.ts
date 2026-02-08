import { ItemType } from '@generated/prisma/enums';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createDiscoverItem,
  getDiscoverItemById,
  getDiscoverList,
  getDiscoverListByType,
} from '../discover';

export const discoverKeys = {
  all: ['discover'] as const,
  lists: () => [...discoverKeys.all, 'list'] as const,
  type: (type: ItemType) => [...discoverKeys.all, 'type', type] as const,
  detail: (id: string) => [...discoverKeys.all, 'detail', id] as const,
  mutations: {
    create: () => [...discoverKeys.all, 'create'] as const,
  },
};

export const discoverQueries = {
  all: () =>
    queryOptions({
      queryKey: discoverKeys.lists(),
      queryFn: getDiscoverList,
    }),

  type: (type: ItemType) =>
    queryOptions({
      queryKey: discoverKeys.type(type),
      queryFn: () => getDiscoverListByType(type),
    }),

  detail: (type: ItemType, id: string) =>
    queryOptions({
      queryKey: discoverKeys.detail(id),
      queryFn: () => getDiscoverItemById(type, id),
    }),
};

export const discoverMutations = {
  create: () =>
    mutationOptions({
      mutationKey: discoverKeys.mutations.create(),
      mutationFn: createDiscoverItem,
    }),
};
