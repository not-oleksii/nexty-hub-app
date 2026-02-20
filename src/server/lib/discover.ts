import { DiscoverItem } from '@generated/prisma/client';
import { DiscoverItemType } from '@generated/prisma/enums';

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
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  isSaved: boolean;
  isCompleted: boolean;
};

export async function getDiscoverItems(): ServerResponse<DiscoverItemData[]> {
  try {
    const userId = await getUserId();
    const items = await prisma.discoverItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        userLists: {
          include: {
            owner: { select: { id: true } },
            members: { select: { userId: true } },
          },
        },
        trackers: {
          where: { status: 'COMPLETED' },
          select: { userId: true },
        },
      },
    });

    const discoverItems = items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      isSaved:
        !!userId &&
        item.userLists.some(
          (list) =>
            list.owner?.id === userId ||
            list.members.some((m) => m.userId === userId),
        ),
      isCompleted: !!userId && item.trackers.some((t) => t.userId === userId),
    }));

    return ResponseService.success({
      data: discoverItems,
      message: 'Discover items fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getDiscoverItemsByType(
  type: DiscoverItemType,
): ServerResponse<DiscoverItemData[]> {
  try {
    const userId = await getUserId();
    const items = await prisma.discoverItem.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
      include: {
        userLists: {
          include: {
            owner: { select: { id: true } },
            members: { select: { userId: true } },
          },
        },
        trackers: {
          where: { status: 'COMPLETED' },
          select: { userId: true },
        },
      },
    });

    const discoverItems = items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      isSaved:
        !!userId &&
        item.userLists.some(
          (list) =>
            list.owner?.id === userId ||
            list.members.some((m) => m.userId === userId),
        ),
      isCompleted: !!userId && item.trackers.some((t) => t.userId === userId),
    }));

    return ResponseService.success({
      data: discoverItems,
      message: 'Discover items fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error fetching discover items by type:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getDiscoverItemById(
  id: string,
): ServerResponse<DiscoverItemData> {
  try {
    const userId = await getUserId();
    const item = await prisma.discoverItem.findUnique({
      where: { id },
      include: {
        userLists: {
          include: {
            owner: { select: { id: true } },
            members: { select: { userId: true } },
          },
        },
        trackers: {
          where: { status: 'COMPLETED' },
          select: { userId: true },
        },
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
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      isSaved:
        !!userId &&
        item.userLists.some(
          (list) =>
            list.owner?.id === userId ||
            list.members.some((m) => m.userId === userId),
        ),
      isCompleted: !!userId && item.trackers.some((t) => t.userId === userId),
    };

    return ResponseService.success({
      data: discoverItem,
      message: 'Discover items fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error fetching discover item by id:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

type DiscoverItemSearchResult = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
};

export async function searchDiscoverItems(
  query: string,
  limit = 20,
): ServerResponse<DiscoverItemSearchResult[]> {
  try {
    const trimmed = query.trim();

    if (!trimmed || trimmed.length < 2) {
      return ResponseService.success({
        data: [],
        message: 'Search query must be at least 2 characters',
      });
    }

    const items = await prisma.discoverItem.findMany({
      where: {
        title: {
          contains: trimmed,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        type: true,
        title: true,
        category: true,
        imageUrl: true,
      },
      take: limit,
      orderBy: { title: 'asc' },
    });

    return ResponseService.success({
      data: items,
      message: 'Search results fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error searching discover items:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function createDiscoverItem(
  body: DiscoverItemSchema,
): ServerResponse<DiscoverItem> {
  try {
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
        type: validationResult.data.type,
        category: validationResult.data.category || null,
        title: validationResult.data.title,
        description: validationResult.data.description || null,
        imageUrl: validationResult.data.imageUrl || null,
        ...(validationResult.data.completed &&
          userId && {
            trackers: {
              create: {
                userId,
                status: 'COMPLETED',
              },
            },
          }),
      },
    });

    return ResponseService.success({
      data: discoverItem,
      message: 'Discover item created successfully',
      status: HttpStatus.CREATED,
    });
  } catch (error: unknown) {
    console.error('Error creating discover item:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
