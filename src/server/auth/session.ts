import 'server-only';

import { cookies } from 'next/headers';

import { AUTH_COOKIE } from '@/constants/auth';

export async function getUserId() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);

  return authCookie?.value ?? null;
}
