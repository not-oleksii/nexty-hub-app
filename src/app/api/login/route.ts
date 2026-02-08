import { NextResponse } from 'next/server';

import { scryptSync, timingSafeEqual } from 'crypto';

import { AUTH_COOKIE } from '@/constants/auth';
import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(':');

  if (!salt || !expectedHex) {
    return false;
  }

  const actualHex = scryptSync(password, salt, 64).toString('hex');
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = Buffer.from(actualHex, 'hex');

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 },
      );
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 },
    );

    response.cookies.set({
      name: AUTH_COOKIE,
      value: user.id,
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
      { status: 500 },
    );
  }
}
