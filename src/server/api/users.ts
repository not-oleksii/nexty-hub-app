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

export async function createUser(payload: CreateUserPayload) {
  return postJson<CreateUserResponse>('/api/users', payload);
}

export async function getCurrentUser() {
  return getJson<CurrentUserResponse>('/api/users/current');
}
