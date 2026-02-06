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

  if (body.username.trim().length < 3 || body.password.length < 8) {
    return NextResponse.json(
      { error: 'username and password are required' },
      { status: 400 },
    );
  }

  const user = await prisma.user.create({
    data: {
      username: body.username.trim(),
      passwordHash: hashPassword(body.password),
    },
    include: {
      lists: { include: { discoverItem: true } },
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
