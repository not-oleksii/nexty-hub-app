import { Prisma, UserList } from '@generated/prisma/client';
import { FriendshipStatus, ListRole } from '@generated/prisma/enums';

import { ListSchema, listSchema } from '@/lib/validators/list';

import { getUserId } from '../auth/session';
import { prisma } from '../db/prisma';
import { ApiErrorType, HttpStatus } from '../http/types';
import { ResponseService, ServerResponse } from '../services/response-service';

type DiscoverItemInList = Prisma.DiscoverItemGetPayload<{
  select: {
    id: true;
    title: true;
    imageUrl: true;
    type: true;
    category: true;
    description: true;
    owner: {
      select: {
        id: true;
        username: true;
      };
    };
  };
}>;

export type UserListWithProgress = {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  tags: string[];
  visibility: string;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  owner: { id: string; username: string };
  members: { id: string; username: string }[];
  discoverItems: DiscoverItemInList[];
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
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: {
        id: true,
        name: true,
        description: true,
        coverImageUrl: true,
        tags: true,
        visibility: true,
        viewsCount: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          select: {
            id: true,
            user: {
              select: { username: true },
            },
          },
        },
        discoverItems: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            type: true,
            category: true,
            description: true,
            owner: {
              select: {
                id: true,
                username: true,
              },
            },
            trackers: {
              where: { userId, status: 'COMPLETED' },
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
        item.trackers.some((t) => t.id),
      ).length;
      const owner = { ...list.owner };

      if (owner.id === userId) {
        owner.username = 'You';
      }

      return {
        id: list.id,
        name: list.name,
        description: list.description,
        coverImageUrl: list.coverImageUrl,
        tags: list.tags,
        visibility: list.visibility,
        viewsCount: list.viewsCount,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
        owner,
        members: list.members.map((m) => ({
          id: m.id,
          username: m.user.username,
        })),
        discoverItems: list.discoverItems.map(
          ({ trackers: _trackers, ...item }) => item,
        ),
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
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        discoverItems: { some: { id } },
      },
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

    const existingList = await prisma.userList.findFirst({
      where: {
        name: { equals: validationResult.data.name, mode: 'insensitive' },
        ownerId: userId,
      },
    });

    if (existingList) {
      return ResponseService.error({
        message: `List with name "${validationResult.data.name}" already exists`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const {
      name,
      description,
      coverImageUrl,
      tags,
      memberIds = [],
      discoverItemIds = [],
      visibility,
    } = validationResult.data;

    if (memberIds.length > 0) {
      const friendships = await prisma.friendship.findMany({
        where: {
          status: FriendshipStatus.ACCEPTED,
          OR: [{ requesterId: userId }, { addresseeId: userId }],
        },
        select: {
          requesterId: true,
          addresseeId: true,
        },
      });

      const friendIds = new Set(
        friendships.flatMap((f) =>
          f.requesterId === userId ? [f.addresseeId] : [f.requesterId],
        ),
      );

      const invalidMember = memberIds.find((id) => !friendIds.has(id));

      if (invalidMember) {
        return ResponseService.error({
          message: 'Can only add accepted friends as list members',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    if (discoverItemIds.length > 0) {
      const existingItems = await prisma.discoverItem.findMany({
        where: { id: { in: discoverItemIds } },
        select: { id: true },
      });

      const existingIds = new Set(existingItems.map((i) => i.id));
      const invalidItem = discoverItemIds.find((id) => !existingIds.has(id));

      if (invalidItem) {
        return ResponseService.error({
          message: 'One or more discover items not found',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const list = await prisma.userList.create({
      data: {
        name,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        tags: tags ?? [],
        visibility,
        owner: { connect: { id: userId } },
        ...(memberIds?.length
          ? {
              members: {
                create: memberIds.map((memberId) => ({
                  userId: memberId,
                  role: ListRole.VIEWER,
                })),
              },
            }
          : {}),
        ...(discoverItemIds?.length
          ? {
              discoverItems: {
                connect: discoverItemIds.map((id) => ({ id })),
              },
            }
          : {}),
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

export type UserListDetailDiscoverItem = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
};

export type UserListDetail = {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  tags: string[];
  visibility: string;
  ownerId: string;
  memberIds: string[];
  discoverItems: UserListDetailDiscoverItem[];
};

export async function getListById(
  listId: string,
): ServerResponse<UserListDetail> {
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
        id: true,
        name: true,
        description: true,
        coverImageUrl: true,
        tags: true,
        visibility: true,
        ownerId: true,
        members: {
          select: { userId: true },
        },
        discoverItems: {
          select: {
            id: true,
            type: true,
            title: true,
            category: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!list) {
      return ResponseService.error({
        message: `List with id ${listId} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (list.ownerId !== userId) {
      return ResponseService.error({
        message: 'You can only edit your own lists',
        status: HttpStatus.FORBIDDEN,
      });
    }

    const data: UserListDetail = {
      id: list.id,
      name: list.name,
      description: list.description,
      coverImageUrl: list.coverImageUrl,
      tags: list.tags,
      visibility: list.visibility,
      ownerId: list.ownerId,
      memberIds: list.members.map((m) => m.userId),
      discoverItems: list.discoverItems.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
      })),
    };

    return ResponseService.success({
      data,
      message: 'List fetched successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error fetching list:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getListViewData(
  listId: string,
): ServerResponse<UserListWithProgress> {
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
        id: true,
        name: true,
        description: true,
        coverImageUrl: true,
        tags: true,
        visibility: true,
        viewsCount: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        owner: { select: { id: true, username: true } },
        members: {
          select: {
            id: true,
            userId: true,
            user: { select: { username: true } },
          },
        },
        discoverItems: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            type: true,
            category: true,
            description: true,
            owner: { select: { id: true, username: true } },
            trackers: {
              where: { userId, status: 'COMPLETED' },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!list) {
      return ResponseService.error({
        message: `List with id ${listId} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const isMember = list.members.some((m) => m.userId === userId);
    if (list.ownerId !== userId && !isMember) {
      return ResponseService.error({
        message: 'You do not have access to this list',
        status: HttpStatus.FORBIDDEN,
      });
    }

    const totalDiscoverItems = list.discoverItems.length;
    const completedDiscoverItems = list.discoverItems.filter((item) =>
      item.trackers.some((t) => t.id),
    ).length;
    const owner = { ...list.owner };
    if (owner.id === userId) {
      owner.username = 'You';
    }

    const data: UserListWithProgress = {
      id: list.id,
      name: list.name,
      description: list.description,
      coverImageUrl: list.coverImageUrl,
      tags: list.tags,
      visibility: list.visibility,
      viewsCount: list.viewsCount,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      owner,
      members: list.members.map((m) => ({
        id: m.id,
        username: m.user.username,
      })),
      discoverItems: list.discoverItems.map(
        ({ trackers: _trackers, ...item }) => item,
      ),
      totalDiscoverItems,
      completedDiscoverItems,
    };

    return ResponseService.success({
      data,
      message: 'List view data fetched successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error fetching list view:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

const updateListSchema = listSchema;

export async function updateList(
  listId: string,
  body: ListSchema,
): ServerResponse<UserList> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const validationResult = updateListSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message ?? ApiErrorType.BAD_REQUEST;

      return ResponseService.error({
        message: firstError,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const list = await prisma.userList.findUnique({
      where: { id: listId },
      select: { ownerId: true },
    });

    if (!list) {
      return ResponseService.error({
        message: `List with id ${listId} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (list.ownerId !== userId) {
      return ResponseService.error({
        message: 'You can only edit your own lists',
        status: HttpStatus.FORBIDDEN,
      });
    }

    const {
      name,
      description,
      coverImageUrl,
      tags,
      memberIds = [],
      discoverItemIds = [],
      visibility,
    } = validationResult.data;

    if (memberIds.length > 0) {
      const friendships = await prisma.friendship.findMany({
        where: {
          status: FriendshipStatus.ACCEPTED,
          OR: [{ requesterId: userId }, { addresseeId: userId }],
        },
        select: {
          requesterId: true,
          addresseeId: true,
        },
      });

      const friendIds = new Set(
        friendships.flatMap((f) =>
          f.requesterId === userId ? [f.addresseeId] : [f.requesterId],
        ),
      );

      const invalidMember = memberIds.find((id) => !friendIds.has(id));

      if (invalidMember) {
        return ResponseService.error({
          message: 'Can only add accepted friends as list members',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    if (discoverItemIds.length > 0) {
      const existingItems = await prisma.discoverItem.findMany({
        where: { id: { in: discoverItemIds } },
        select: { id: true },
      });

      const existingIds = new Set(existingItems.map((i) => i.id));
      const invalidItem = discoverItemIds.find((id) => !existingIds.has(id));

      if (invalidItem) {
        return ResponseService.error({
          message: 'One or more discover items not found',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const updatedList = await prisma.userList.update({
      where: { id: listId },
      data: {
        name,
        description: description?.trim() || null,
        coverImageUrl: coverImageUrl?.trim() || null,
        tags: tags ?? [],
        visibility,
        members: {
          deleteMany: {},
          ...(memberIds.length > 0
            ? {
                create: memberIds.map((memberId) => ({
                  userId: memberId,
                  role: ListRole.VIEWER,
                })),
              }
            : {}),
        },
        discoverItems: {
          set: discoverItemIds.map((id) => ({ id })),
        },
      },
    });

    return ResponseService.success({
      data: updatedList,
      message: 'List updated successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error updating list:', error);

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
