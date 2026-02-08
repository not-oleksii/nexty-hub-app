import { NextResponse } from 'next/server';

import { Prisma, User } from '@generated/prisma/client';
import { randomBytes, scryptSync } from 'crypto';

import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

type CreateUserBody = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'passwordHash'
> & {
  password: string;
};

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');

  return `${salt}:${hash}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateUserBody;

    if (!body?.username || !body?.password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 },
      );
    }

    const username = body.username.trim();
    const password = body.password;

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: 'Invalid username length' },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username already exists' },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hashPassword(password),
      },
      include: {
        lists: { include: { items: true } },
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
