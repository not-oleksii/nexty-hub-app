import { postJson } from '../utils/fetch-json';

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  message: string;
};

type LogoutResponse = {
  message: string;
};

export const authApi = {
  login: (payload: LoginPayload) =>
    postJson<LoginResponse>('/api/auth/login', payload),

  logout: () => postJson<LogoutResponse>('/api/auth/logout'),
};
