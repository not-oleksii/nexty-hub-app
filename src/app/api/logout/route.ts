import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'nexty_auth';

export async function POST() {
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
}
