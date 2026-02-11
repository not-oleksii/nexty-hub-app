import 'server-only';

import { cookies } from 'next/headers';

import { AUTH_COOKIE } from '@/constants/auth';

export const AUTH_COOKIE_NAME = AUTH_COOKIE;

export async function getUserId() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  return authCookie?.value ?? null;
}
