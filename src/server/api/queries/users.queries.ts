import { mutationOptions } from '@tanstack/react-query';

import { createUser, loginUser } from '../users';

export const usersKeys = {
  all: ['users'] as const,
  mutations: {
    create: () => [...usersKeys.all, 'create'] as const,
    login: () => [...usersKeys.all, 'login'] as const,
  },
};

export const usersQueries = {};

export const usersMutations = {
  create: () =>
    mutationOptions({
      mutationKey: usersKeys.mutations.create(),
      mutationFn: createUser,
    }),
  login: () =>
    mutationOptions({
      mutationKey: usersKeys.mutations.login(),
      mutationFn: loginUser,
    }),
};
