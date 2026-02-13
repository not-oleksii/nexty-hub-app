import { Prisma, UserList } from '@generated/prisma/client';

import { ListSchema, listSchema } from '@/lib/validators/list';

import { getUserId } from '../auth/session';
import { prisma } from '../db/prisma';
import { ApiErrorType, HttpStatus } from '../http/types';
import { ResponseService, ServerResponse } from '../services/response-service';

export type UserListWithProgress = Prisma.UserListGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    owner: {
      select: { id: true; username: true };
    };
    discoverItems: {
      select: {
        id: true;
        usersCompleted: {
          select: { id: true };
        };
      };
    };
  };
}> & {
  totalDiscoverItems: number;
  completedDiscoverItems: number;
};

export type UserListWithItemStatus = Prisma.UserListGetPayload<{
  select: {
    id: true;
    name: true;
    discoverItems: {
      select: { id: true };
    };
  };
}>;

export async function getUserLists(): ServerResponse<UserListWithProgress[]> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
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
        discoverItems: {
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
      const totalDiscoverItems = list.discoverItems.length;
      const completedDiscoverItems = list.discoverItems.filter((item) =>
        item.usersCompleted.some((user) => user.id === userId),
      ).length;
      const owner = list.owner;

      if (owner.id === userId) {
        owner.username = 'You';
      }

      return {
        id: list.id,
        name: list.name,
        createdAt: list.createdAt,
        owner,
        discoverItems: list.discoverItems,
        totalDiscoverItems,
        completedDiscoverItems,
      };
    });

    return ResponseService.success({
      data: listsWithProgress,
      message: 'User lists fetched successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error fetching user lists:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getUserListsByDiscoverItemId(
  id: string,
): ServerResponse<UserListWithItemStatus[]> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const lists = await prisma.userList.findMany({
      where: { users: { some: { id: userId } } },
      select: {
        id: true,
        name: true,
        discoverItems: {
          where: { id },
          select: { id: true },
        },
      },
    });

    return ResponseService.success({
      data: lists,
      message: 'User lists fetched successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error fetching user lists by item:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function createList(body: ListSchema): ServerResponse<UserList> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const validationResult = listSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message ?? ApiErrorType.BAD_REQUEST;

      return ResponseService.error({
        message: firstError,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const list = await prisma.userList.create({
      data: {
        name: validationResult.data.name,
        owner: {
          connect: {
            id: userId,
          },
        },
        users: {
          connect: { id: userId },
        },
      },
    });

    return ResponseService.success({
      data: list,
      message: 'List created successfully',
      status: HttpStatus.CREATED,
    });
  } catch (error: unknown) {
    console.error('Error creating list:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function addOrRemoveDiscoverItemToList(
  listId: string,
  discoverItemId: string,
): ServerResponse<UserList> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const list = await prisma.userList.findUnique({
      where: { id: listId },
      select: {
        discoverItems: {
          select: { id: true },
        },
      },
    });

    if (!list) {
      return ResponseService.error({
        message: `List with id ${listId} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const doesListContainSelectedDiscoverItem = list.discoverItems.some(
      (item) => item.id === discoverItemId,
    );

    if (doesListContainSelectedDiscoverItem) {
      const updatedList = await prisma.userList.update({
        where: { id: listId },
        data: {
          discoverItems: {
            disconnect: { id: discoverItemId },
          },
        },
      });

      const discoverItemDoesNotExistInAnyCurrentUserLists =
        (
          await prisma.userList.findMany({
            where: {
              discoverItems: { some: { id: discoverItemId } },
              AND: { users: { some: { id: userId } } },
            },
            select: { id: true },
          })
        ).length === 0;

      if (discoverItemDoesNotExistInAnyCurrentUserLists) {
        await prisma.user.update({
          where: { id: userId },
          data: { savedDiscoverItems: { disconnect: { id: discoverItemId } } },
        });
      }

      return ResponseService.success({
        data: updatedList,
        message: 'Discover item removed from list successfully',
        status: HttpStatus.OK,
      });
    }

    const discoverItem = await prisma.discoverItem.findUnique({
      where: { id: discoverItemId },
    });

    if (!discoverItem) {
      return ResponseService.error({
        message: `Discover item with id ${discoverItemId} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const updatedList = await prisma.userList.update({
      where: { id: listId },
      data: {
        discoverItems: {
          connect: { id: discoverItemId },
        },
        users: {
          connect: { id: userId },
        },
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        savedDiscoverItems: {
          connect: { id: discoverItemId },
        },
      },
    });

    return ResponseService.success({
      data: updatedList,
      message: 'Discover item added to list successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error adding discover item to list:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
