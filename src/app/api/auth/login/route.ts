import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '@/server/auth/session';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { login } from '@/server/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const { error, status, message, data } = await login(username, password);

    if (error) {
      return NextResponse.json({ error: error?.message }, { status: status });
    }

    if (!data) {
      return NextResponse.json(
        { error: ApiErrorType.BAD_REQUEST },
        { status: status },
      );
    }

    const response = NextResponse.json({ message }, { status: status });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.userId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
