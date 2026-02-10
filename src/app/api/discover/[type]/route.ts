import { NextResponse } from 'next/server';

import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

import { ApiErrorType } from '../../error-types';

type Params = {
  params: Promise<{ type: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    const { type } = await params;

    const prismaType = mapItemTypeToPrisma(type);

    const items = await prisma.discoverItem.findMany({
      where: { type: prismaType },
      include: {
        usersSaved: { select: { id: true } },
        usersCompleted: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ items: itemsWithStatus }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
