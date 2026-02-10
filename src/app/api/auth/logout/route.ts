import { NextResponse } from 'next/server';

import { ApiErrorType } from '@/app/api/error-types';
import { AUTH_COOKIE } from '@/constants/auth';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 },
    );

    response.cookies.set({
      name: AUTH_COOKIE,
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
      { status: 500 },
    );
  }
}
