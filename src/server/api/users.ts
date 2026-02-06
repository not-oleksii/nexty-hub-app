import { postJson } from '@/server/http/get-base-url';

import { DiscoverItemDto } from './discover';

type CreateUserPayload = {
  username: string;
  password: string;
  lists?: DiscoverItemDto[];
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
