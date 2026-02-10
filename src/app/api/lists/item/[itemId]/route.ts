import { NextResponse } from 'next/server';

import { ApiErrorType } from '@/app/api/error-types';
import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

type Params = {
  params: Promise<{ itemId: string }>;
};

type UserListItemDto = {
  id: string;
  name: string;
  hasItem: boolean;
};

type UserListResponse = {
  lists: UserListItemDto[];
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await params;

    const lists = await prisma.userList.findMany({
      where: { users: { some: { id: userId } } },
      select: {
        id: true,
        name: true,
        items: {
          where: { id: itemId },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const listsWithStatus = lists.map((list) => ({
      id: list.id,
      name: list.name,
      hasItem: list.items.length > 0,
    }));

    return NextResponse.json<UserListResponse>(
      { lists: listsWithStatus },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Error fetching lists for item:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
