import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '@/server/auth/session';
import { ApiErrorType, HttpStatus } from '@/server/http/types';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: HttpStatus.OK },
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error logging out:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
