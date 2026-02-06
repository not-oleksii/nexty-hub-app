import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';

const AUTH_COOKIE = 'nexty_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get(AUTH_COOKIE);

  if (!authCookie?.value) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname === ROUTES.home ||
    pathname === ROUTES.login ||
    pathname === ROUTES.signup
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROUTES.discoverList.root;

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    ROUTES.home,
    ROUTES.login,
    ROUTES.signup,
    `${ROUTES.discoverList.root}/:path*`,
  ],
};
