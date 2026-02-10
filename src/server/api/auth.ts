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

export async function login(payload: LoginPayload) {
  return postJson<LoginResponse>('/api/auth/login', payload);
}

export async function logout() {
  return postJson<LogoutResponse>('/api/auth/logout');
}
