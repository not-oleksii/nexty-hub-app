import { DiscoverItemType, type TrackingStatus } from '@generated/prisma/enums';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { discoverApi } from '../discover';

export const discoverKeys = {
  all: ['discover'] as const,
  lists: () => [...discoverKeys.all, 'list'] as const,
  type: (type: DiscoverItemType) =>
    [...discoverKeys.all, 'type', type] as const,
  detail: (id: string) => [...discoverKeys.all, 'detail', id] as const,
  tracked: (status?: TrackingStatus) =>
    [...discoverKeys.all, 'tracked', status ?? 'all'] as const,
  search: (query: string, limit?: number) =>
    [...discoverKeys.all, 'search', query, limit ?? 20] as const,
  mutations: {
    create: () => [...discoverKeys.all, 'create'] as const,
    updateTracking: () => [...discoverKeys.all, 'updateTracking'] as const,
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

  tracked: (status?: TrackingStatus) =>
    queryOptions({
      queryKey: discoverKeys.tracked(status),
      queryFn: () => discoverApi.getTrackedItems(status),
    }),

  search: (query: string, limit = 20) =>
    queryOptions({
      queryKey: discoverKeys.search(query, limit),
      queryFn: () => discoverApi.search(query, limit),
      enabled: query.length >= 2,
    }),
};

export const discoverMutations = {
  create: () =>
    mutationOptions({
      mutationKey: discoverKeys.mutations.create(),
      mutationFn: discoverApi.create,
    }),

  updateTracking: (itemId: string) =>
    mutationOptions({
      mutationKey: [...discoverKeys.mutations.updateTracking(), itemId],
      mutationFn: (payload: { status?: TrackingStatus; progress?: number }) =>
        discoverApi.updateTracking(itemId, payload),
    }),
};
