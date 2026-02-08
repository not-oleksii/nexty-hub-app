import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_COOKIE } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';

const PRIVATE_ROUTES = [ROUTES.discoverList.root];
const PUBLIC_ROUTES = [ROUTES.home, ROUTES.login, ROUTES.signup];

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE);
  const path = request.nextUrl.pathname;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => path.startsWith(route));

  if (isPrivateRoute && !authCookie) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === '/') {
      return path === route;
    }

    return path.startsWith(route);
  });

  if (
    isPublicRoute &&
    authCookie &&
    !path.startsWith(ROUTES.discoverList.root)
  ) {
    return NextResponse.redirect(
      new URL(ROUTES.discoverList.root, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
