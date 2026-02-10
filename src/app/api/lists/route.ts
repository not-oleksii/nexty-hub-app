import { NextResponse } from 'next/server';

import { User, UserList } from '@generated/prisma/client';

import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

type AddDiscoverItemToListBody = {
  listIds?: string[];
  itemId: string;
};

type UserListSummaryDto = Pick<UserList, 'id' | 'name' | 'createdAt'> & {
  owner: Pick<User, 'id' | 'username'>;
  totalItems: number;
  completedItems: number;
};

type UserListResponse = {
  lists: UserListSummaryDto[];
};

export async function GET(_req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lists = await prisma.userList.findMany({
      where: { users: { some: { id: userId } } },
      select: {
        id: true,
        name: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
        items: {
          select: {
            id: true,
            usersCompleted: {
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const listsWithProgress = lists.map((list) => {
      const totalItems = list.items.length;
      const completedItems = list.items.filter((item) =>
        item.usersCompleted.some((user) => user.id === userId),
      ).length;

      return {
        id: list.id,
        name: list.name,
        createdAt: list.createdAt,
        owner: list.owner,
        totalItems,
        completedItems,
      };
    });

    return NextResponse.json<UserListResponse>(
      { lists: listsWithProgress },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Error fetching user lists:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: ApiErrorType.UNAUTHORIZED },
        { status: 401 },
      );
    }

    const body = (await req.json()) as AddDiscoverItemToListBody;

    if (!body?.itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 },
      );
    }

    const existingLists = await prisma.userList.findMany({
      where: { users: { some: { id: userId } } },
      select: { id: true },
    });

    const userListIds = existingLists.map((list) => list.id);

    if (body.listIds) {
      const selectedIds = body.listIds.filter((id) => userListIds.includes(id));
      const selectedSet = new Set(selectedIds);
      const updates = userListIds.map((listId) =>
        prisma.userList.update({
          where: { id: listId },
          data: {
            items: selectedSet.has(listId)
              ? { connect: { id: body.itemId } }
              : { disconnect: { id: body.itemId } },
          },
        }),
      );

      if (updates.length > 0) {
        await prisma.$transaction(updates);
      }

      return NextResponse.json({ listIds: selectedIds }, { status: 200 });
    }

    if (userListIds.length > 0) {
      return NextResponse.json(
        { error: 'List IDs are required' },
        { status: 400 },
      );
    }

    console.log('userId', userId);

    const list = await prisma.userList.create({
      data: {
        name: 'My List',
        owner: { connect: { id: userId } },
        users: { connect: { id: userId } },
        items: { connect: { id: body.itemId } },
      },
      select: { id: true, name: true },
    });

    return NextResponse.json({ list }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error adding item to list:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
