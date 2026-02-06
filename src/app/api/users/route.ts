import { NextResponse } from 'next/server';

import { randomBytes, scryptSync } from 'crypto';

import { DiscoverItemDto } from '@/server/api/discover';
import { prisma } from '@/server/db/prisma';

type CreateUserBody = {
  username: string;
  password: string;
  lists?: DiscoverItemDto[];
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');

  return `${salt}:${hash}`;
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateUserBody;

  if (!body?.username || !body?.password) {
    return NextResponse.json(
      { error: 'username and password are required' },
      { status: 400 },
    );
  }

  const username = body.username.trim();
  const password = body.password;

  if (username.length < 3 || username.length > 20) {
    return NextResponse.json(
      { error: 'username must be between 3 and 20 characters long' },
      { status: 400 },
    );
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return NextResponse.json(
      { error: 'username must contain only letters and numbers' },
      { status: 400 },
    );
  }

  if (password.length < 8 || password.length > 30) {
    return NextResponse.json(
      { error: 'password must be between 8 and 30 characters long' },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'username already exists' },
      { status: 400 },
    );
  }

  const user = await prisma.user.create({
    data: {
      username: username.trim(),
      passwordHash: hashPassword(password),
    },
    include: {
      lists: { include: { discoverItem: true } },
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
