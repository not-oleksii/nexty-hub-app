import { DiscoverItem } from '@generated/prisma/client';
import { DiscoverItemType, TrackingStatus } from '@generated/prisma/enums';

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
  totalUnits?: number | null;
  unitName?: string | null;
  isSaved: boolean;
  isCompleted: boolean;
  rating: number | null;
  userListsCount: number;
  trackingStatus?: string | null;
  progress?: number | null;
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
          select: { userId: true, status: true, rating: true, progress: true },
        },
      },
    });

    const discoverItems = items.map((item) => {
      const ratedTrackers = item.trackers.filter(
        (
          t,
        ): t is {
          userId: string;
          status: TrackingStatus;
          rating: number;
          progress: number;
        } => t.rating != null,
      );
      const avgRating =
        ratedTrackers.length > 0
          ? Math.round(
              ratedTrackers.reduce((s, t) => s + (t.rating ?? 0), 0) /
                ratedTrackers.length,
            )
          : null;
      const myTracker = userId
        ? item.trackers.find((t) => t.userId === userId)
        : null;

      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        category: item.category,
        imageUrl: item.imageUrl,
        totalUnits: item.totalUnits,
        unitName: item.unitName,
        isSaved:
          !!userId &&
          item.userLists.some(
            (list) =>
              list.owner?.id === userId ||
              list.members.some((m) => m.userId === userId),
          ),
        isCompleted:
          !!userId &&
          item.trackers.some(
            (t) => t.status === TrackingStatus.COMPLETED && t.userId === userId,
          ),
        rating: avgRating,
        userListsCount: item.userLists.length,
        trackingStatus: myTracker?.status ?? null,
        progress: myTracker?.progress ?? null,
      };
    });

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
          select: { userId: true, status: true, rating: true, progress: true },
        },
      },
    });

    const discoverItems = items.map((item) => {
      const ratedTrackers = item.trackers.filter(
        (
          t,
        ): t is {
          userId: string;
          status: TrackingStatus;
          rating: number;
          progress: number;
        } => t.rating != null,
      );
      const avgRating =
        ratedTrackers.length > 0
          ? Math.round(
              ratedTrackers.reduce((s, t) => s + (t.rating ?? 0), 0) /
                ratedTrackers.length,
            )
          : null;
      const myTracker = userId
        ? item.trackers.find((t) => t.userId === userId)
        : null;

      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        category: item.category,
        imageUrl: item.imageUrl,
        totalUnits: item.totalUnits,
        unitName: item.unitName,
        isSaved:
          !!userId &&
          item.userLists.some(
            (list) =>
              list.owner?.id === userId ||
              list.members.some((m) => m.userId === userId),
          ),
        isCompleted:
          !!userId &&
          item.trackers.some(
            (t) => t.status === TrackingStatus.COMPLETED && t.userId === userId,
          ),
        rating: avgRating,
        userListsCount: item.userLists.length,
        trackingStatus: myTracker?.status ?? null,
        progress: myTracker?.progress ?? null,
      };
    });

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
          select: { userId: true, status: true, rating: true, progress: true },
        },
      },
    });

    if (!item) {
      return ResponseService.error({
        message: 'Discover item not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const ratedTrackers = item.trackers.filter(
      (
        t,
      ): t is {
        userId: string;
        status: TrackingStatus;
        rating: number;
        progress: number;
      } => t.rating != null,
    );
    const avgRating =
      ratedTrackers.length > 0
        ? Math.round(
            ratedTrackers.reduce((s, t) => s + (t.rating ?? 0), 0) /
              ratedTrackers.length,
          )
        : null;
    const myTracker = userId
      ? item.trackers.find((t) => t.userId === userId)
      : null;

    const discoverItem: DiscoverItemData = {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      totalUnits: item.totalUnits,
      unitName: item.unitName,
      isSaved:
        !!userId &&
        item.userLists.some(
          (list) =>
            list.owner?.id === userId ||
            list.members.some((m) => m.userId === userId),
        ),
      isCompleted:
        !!userId &&
        item.trackers.some(
          (t) => t.status === TrackingStatus.COMPLETED && t.userId === userId,
        ),
      rating: avgRating,
      userListsCount: item.userLists.length,
      trackingStatus: myTracker?.status ?? null,
      progress: myTracker?.progress ?? null,
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

export type UserTrackedItemDto = {
  id: string;
  title: string;
  imageUrl: string | null;
  status: TrackingStatus;
  type: DiscoverItemType;
};

export async function getUserTrackedItems(options?: {
  status?: TrackingStatus;
}): ServerResponse<UserTrackedItemDto[]> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const trackings = await prisma.userItemTracking.findMany({
      where: {
        userId,
        ...(options?.status != null && { status: options.status }),
      },
      select: {
        status: true,
        item: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            type: true,
          },
        },
      },
    });

    const data: UserTrackedItemDto[] = trackings.map((t) => ({
      id: t.item.id,
      title: t.item.title,
      imageUrl: t.item.imageUrl,
      status: t.status,
      type: t.item.type,
    }));

    return ResponseService.success({
      data,
      message: 'Tracked items fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error fetching user tracked items:', error);

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

export type UpdateTrackingPayload = {
  status?: TrackingStatus;
  progress?: number;
};

export async function updateDiscoverItemTracking(
  itemId: string,
  payload: UpdateTrackingPayload,
): ServerResponse<DiscoverItemData> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const item = await prisma.discoverItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        category: true,
        imageUrl: true,
        totalUnits: true,
        unitName: true,
        userLists: {
          include: {
            owner: { select: { id: true } },
            members: { select: { userId: true } },
          },
        },
        trackers: {
          select: { userId: true, status: true, rating: true, progress: true },
        },
      },
    });

    if (!item) {
      return ResponseService.error({
        message: 'Discover item not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const existing = await prisma.userItemTracking.findUnique({
      where: { userId_itemId: { userId, itemId } },
      select: { status: true, progress: true },
    });

    let newStatus: TrackingStatus | undefined = payload.status;
    let newProgress: number | undefined = payload.progress;

    if (
      payload.status === TrackingStatus.COMPLETED &&
      item.totalUnits != null
    ) {
      newProgress = item.totalUnits;
    }
    if (
      typeof payload.progress === 'number' &&
      payload.progress > 0 &&
      (existing?.status ?? TrackingStatus.BACKLOG) === TrackingStatus.BACKLOG &&
      payload.status === undefined
    ) {
      newStatus = TrackingStatus.IN_PROGRESS;
    }

    await prisma.userItemTracking.upsert({
      where: { userId_itemId: { userId, itemId } },
      create: {
        userId,
        itemId,
        status: newStatus ?? TrackingStatus.BACKLOG,
        progress: newProgress ?? 0,
      },
      update: {
        ...(newStatus != null && { status: newStatus }),
        ...(newProgress != null && { progress: newProgress }),
      },
    });

    const updated = await prisma.discoverItem.findUnique({
      where: { id: itemId },
      include: {
        userLists: {
          include: {
            owner: { select: { id: true } },
            members: { select: { userId: true } },
          },
        },
        trackers: {
          select: { userId: true, status: true, rating: true, progress: true },
        },
      },
    });

    if (!updated) {
      return ResponseService.error({
        message: ApiErrorType.INTERNAL_SERVER_ERROR,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const ratedTrackers = updated.trackers.filter(
      (
        t,
      ): t is {
        userId: string;
        status: TrackingStatus;
        rating: number;
        progress: number;
      } => t.rating != null,
    );
    const avgRating =
      ratedTrackers.length > 0
        ? Math.round(
            ratedTrackers.reduce((s, t) => s + (t.rating ?? 0), 0) /
              ratedTrackers.length,
          )
        : null;
    const myTracker = updated.trackers.find((t) => t.userId === userId);

    const data: DiscoverItemData = {
      id: updated.id,
      type: updated.type,
      title: updated.title,
      description: updated.description,
      category: updated.category,
      imageUrl: updated.imageUrl,
      totalUnits: updated.totalUnits,
      unitName: updated.unitName,
      isSaved: updated.userLists.some(
        (list) =>
          list.owner?.id === userId ||
          list.members.some((m) => m.userId === userId),
      ),
      isCompleted: updated.trackers.some(
        (t) => t.status === TrackingStatus.COMPLETED && t.userId === userId,
      ),
      rating: avgRating,
      userListsCount: updated.userLists.length,
      trackingStatus: myTracker?.status ?? null,
      progress: myTracker?.progress ?? null,
    };

    return ResponseService.success({
      data,
      message: 'Tracking updated successfully',
      status: HttpStatus.OK,
    });
  } catch (error: unknown) {
    console.error('Error updating discover item tracking:', error);

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
                status: TrackingStatus.COMPLETED,
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
