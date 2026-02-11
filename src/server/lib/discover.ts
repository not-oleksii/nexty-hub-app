import { DiscoverItem } from '@generated/prisma/client';
import { ItemType } from '@generated/prisma/enums';

import {
  type DiscoverItemSchema,
  discoverItemSchema,
} from '@/lib/validators/discovery-item';

import { getUserId } from '../auth/session';
import { prisma } from '../db/prisma';
import { ApiErrorType, HttpStatus } from '../http/types';
import {
  ResponseService,
  type ServerResponse,
} from '../services/response-service';

type DiscoverItemData = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
  isSaved: boolean;
  isCompleted: boolean;
};

function includesUserId(userId: string | null, array: Array<{ id: string }>) {
  return userId ? array.some((item) => item.id === userId) : false;
}

export async function getDiscoverItems(): ServerResponse<DiscoverItemData[]> {
  const userId = await getUserId();
  const items = await prisma.discoverItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      usersSaved: { select: { id: true } },
      usersCompleted: { select: { id: true } },
    },
  });

  const discoverItems = items.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    category: item.category,
    imageUrl: item.imageUrl,
    isSaved: includesUserId(userId, item.usersSaved),
    isCompleted: includesUserId(userId, item.usersCompleted),
  }));

  return ResponseService.success({
    data: discoverItems,
    message: 'Discover items fetched successfully',
  });
}

export async function getDiscoverItemsByType(
  type: ItemType,
): ServerResponse<DiscoverItemData[]> {
  const userId = await getUserId();
  const items = await prisma.discoverItem.findMany({
    where: { type },
    orderBy: { createdAt: 'desc' },
    include: {
      usersSaved: { select: { id: true } },
      usersCompleted: { select: { id: true } },
    },
  });

  const discoverItems = items.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    category: item.category,
    imageUrl: item.imageUrl,
    isSaved: includesUserId(userId, item.usersSaved),
    isCompleted: includesUserId(userId, item.usersCompleted),
  }));

  return ResponseService.success({
    data: discoverItems,
    message: 'Discover items fetched successfully',
  });
}

export async function getDiscoverItemById(
  id: string,
): ServerResponse<DiscoverItemData> {
  const userId = await getUserId();
  const item = await prisma.discoverItem.findUnique({
    where: { id },
    include: {
      usersSaved: { select: { id: true } },
      usersCompleted: { select: { id: true } },
    },
  });

  if (!item) {
    return ResponseService.error({
      message: 'Discover item not found',
      status: HttpStatus.NOT_FOUND,
    });
  }

  const discoverItem = {
    id: item.id,
    type: item.type,
    title: item.title,
    category: item.category,
    imageUrl: item.imageUrl,
    isSaved: includesUserId(userId, item.usersSaved),
    isCompleted: includesUserId(userId, item.usersCompleted),
  };

  return ResponseService.success({
    data: discoverItem,
    message: 'Discover items fetched successfully',
  });
}

export async function createDiscoverItem(
  body: DiscoverItemSchema,
): ServerResponse<DiscoverItem> {
  const userId = await getUserId();

  if (!userId) {
    return ResponseService.error({
      message: ApiErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  const validationResult = discoverItemSchema.safeParse(body);

  if (!validationResult.success) {
    const firstError =
      validationResult.error.issues[0]?.message ?? ApiErrorType.BAD_REQUEST;

    return ResponseService.error({
      message: firstError,
      status: HttpStatus.BAD_REQUEST,
    });
  }

  const { title } = validationResult.data;

  const existingItem = await prisma.discoverItem.findFirst({
    where: { title },
    select: { id: true },
  });

  if (existingItem) {
    return ResponseService.error({
      message: 'Title must be unique',
      status: HttpStatus.CONFLICT,
    });
  }

  const discoverItem = await prisma.discoverItem.create({
    data: {
      ...validationResult.data,
      ...(validationResult.data.completed && userId
        ? { usersCompleted: { connect: { id: userId } } }
        : {}),
    },
  });

  return ResponseService.success({
    data: discoverItem,
    message: 'Discover item created successfully',
    status: HttpStatus.CREATED,
  });
}
