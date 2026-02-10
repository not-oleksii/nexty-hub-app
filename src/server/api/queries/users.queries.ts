import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { createUser, getCurrentUser } from '../users';

export const usersKeys = {
  all: ['users'] as const,
  current: () => [...usersKeys.all, 'current'] as const,
  mutations: {
    create: () => [...usersKeys.all, 'create'] as const,
  },
};

export const usersQueries = {
  current: () =>
    queryOptions({
      queryKey: usersKeys.current(),
      queryFn: getCurrentUser,
    }),
};

export const usersMutations = {
  create: () =>
    mutationOptions({
      mutationKey: usersKeys.mutations.create(),
      mutationFn: createUser,
    }),
};
