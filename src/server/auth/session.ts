import 'server-only';

import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME =
  process.env.NEXTY_AUTH_COOKIE_NAME ?? 'nexty_auth';

export async function getUserId() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  return authCookie?.value ?? null;
}
