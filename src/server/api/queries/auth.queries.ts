import { mutationOptions } from '@tanstack/react-query';

import { login, logout } from '../auth';

export const authKeys = {
  all: ['auth'] as const,
  mutations: {
    login: () => [...authKeys.all, 'login'] as const,
    logout: () => [...authKeys.all, 'logout'] as const,
  },
};

export const usersQueries = {};

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationKey: authKeys.mutations.login(),
      mutationFn: login,
    }),
  logout: () =>
    mutationOptions({
      mutationKey: authKeys.mutations.logout(),
      mutationFn: logout,
    }),
};
