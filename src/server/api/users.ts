import { SignupSchema } from '@/lib/validators/signup';
import type { CurrentUserResponse } from '@/server/lib/users';
import { getJson, postJson } from '@/server/utils/fetch-json';

export const usersApi = {
  create: (payload: SignupSchema) =>
    postJson<CurrentUserResponse>('/api/users', payload),

  getCurrentUser: () => getJson<CurrentUserResponse>('/api/users/current'),
};
