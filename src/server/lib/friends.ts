import { FriendshipStatus } from '@generated/prisma/enums';

import { getUserId } from '../auth/session';
import { prisma } from '../db/prisma';
import { ApiErrorType, HttpStatus } from '../http/types';
import {
  ResponseService,
  type ServerResponse,
} from '../services/response-service';

export type FriendSummary = {
  id: string;
  username: string;
};

export async function getAcceptedFriends(): ServerResponse<FriendSummary[]> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { select: { id: true, username: true } },
        addressee: { select: { id: true, username: true } },
      },
    });

    const friends: FriendSummary[] = friendships.map((f) => {
      const friend = f.requesterId === userId ? f.addressee : f.requester;

      return { id: friend.id, username: friend.username };
    });

    return ResponseService.success({
      data: friends,
      message: 'Friends fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error fetching friends:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
