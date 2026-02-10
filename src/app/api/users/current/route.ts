import { NextResponse } from 'next/server';

import { ApiErrorType } from '@/app/api/error-types';
import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: ApiErrorType.UNAUTHORIZED },
        { status: 401 },
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lists: true,
        ownedLists: true,
      },
    });

    const discoverItems = await prisma.discoverItem.findMany({
      where: {
        usersSaved: { some: { id: userId } },
      },
    });

    const completedItems = await prisma.discoverItem.findMany({
      where: {
        usersCompleted: { some: { id: userId } },
      },
    });

    const user = {
      ...userData,
      discoverItems,
      completedItems,
    };

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching current user:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
