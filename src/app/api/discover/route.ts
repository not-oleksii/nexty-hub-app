import { NextResponse } from 'next/server';

import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

export async function GET() {
  try {
    const userId = await getUserId();
    const items = await prisma.discoverItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        usersSaved: { select: { id: true } },
        usersCompleted: { select: { id: true } },
      },
    });

    const itemsWithStatus = items.map((item) => ({
      ...item,
      isSaved: userId
        ? item.usersSaved.some((user) => user.id === userId)
        : false,
      isCompleted: userId
        ? item.usersCompleted.some((user) => user.id === userId)
        : false,
    }));

    return NextResponse.json({ items: itemsWithStatus });
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
