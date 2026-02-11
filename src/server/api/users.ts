import { DiscoverItem, User, UserList } from '@generated/prisma/client';

import { getJson, postJson } from '@/server/utils/fetch-json';

type CreateUserPayload = {
  username: string;
  password: string;
  lists?: DiscoverItem[];
};

type CreateUserResponse = {
  user: unknown;
};

type CurrentUserResponse = Omit<
  User,
  'passwordHash' | 'createdAt' | 'updatedAt'
> & {
  lists: UserList[];
  ownedLists: UserList[];
  savedItems: DiscoverItem[];
  completedItems: DiscoverItem[];
  discoverItems: DiscoverItem[];
};

export const usersApi = {
  create: (payload: CreateUserPayload) =>
    postJson<CreateUserResponse>('/api/users', payload),
  getCurrent: () => getJson<CurrentUserResponse>('/api/users/current'),
};
