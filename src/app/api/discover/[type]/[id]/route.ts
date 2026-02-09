import { NextResponse } from 'next/server';

import { ApiErrorType } from '@/app/api/error-types';
import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

type Params = {
  params: Promise<{ type: string; id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    const { type, id } = await params;

    const prismaType = mapItemTypeToPrisma(type);

    const item = await prisma.discoverItem.findUnique({
      where: { type: prismaType, id },
      include: {
        usersSaved: { select: { id: true } },
        usersCompleted: { select: { id: true } },
      },
    });

    if (!item) {
      return NextResponse.json({ item: null }, { status: 200 });
    }

    const itemWithStatus = {
      ...item,
      isSaved: userId
        ? item.usersSaved.some((user) => user.id === userId)
        : false,
      isCompleted: userId
        ? item.usersCompleted.some((user) => user.id === userId)
        : false,
    };

    return NextResponse.json({ item: itemWithStatus });
  } catch (error: unknown) {
    console.error('Error fetching discover item:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
