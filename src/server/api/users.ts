import { DiscoverItem } from '@generated/prisma/browser';

import { postJson } from '@/server/lib/fetch-json';

type CreateUserPayload = {
  username: string;
  password: string;
  lists?: DiscoverItem[];
};

type CreateUserResponse = {
  user: unknown;
};

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  message: string;
};

export async function createUser(payload: CreateUserPayload) {
  return postJson<CreateUserResponse>('/api/users', payload);
}

export async function loginUser(payload: LoginPayload) {
  return postJson<LoginResponse>('/api/login', payload);
}
