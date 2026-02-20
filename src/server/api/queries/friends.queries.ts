import { queryOptions } from '@tanstack/react-query';

import { friendsApi } from '../friends';

export const friendsKeys = {
  all: ['friends'] as const,
  accepted: () => [...friendsKeys.all, 'accepted'] as const,
};

export const friendsQueries = {
  accepted: () =>
    queryOptions({
      queryKey: friendsKeys.accepted(),
      queryFn: friendsApi.getAccepted,
    }),
};
