import { LoginSchema } from '@/lib/validators/login';

import { postJson } from '../utils/fetch-json';

export const authApi = {
  login: (payload: LoginSchema) =>
    postJson<{ message: string }>('/api/auth/login', payload),

  logout: () => postJson<{ message: string }>('/api/auth/logout'),
};
