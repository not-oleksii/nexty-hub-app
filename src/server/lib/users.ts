import type { Prisma } from '@generated/prisma/client';
import { User } from '@generated/prisma/client';

import { SignupSchema, signupSchema } from '@/lib/validators/signup';

import { getUserId } from '../auth/session';
import { prisma } from '../db/prisma';
import { ApiErrorType, HttpStatus } from '../http/types';
import {
  ResponseService,
  type ServerResponse,
} from '../services/response-service';
import { hashPassword } from '../utils/password';

export type CurrentUserResponse = Prisma.UserGetPayload<{
  include: {
    lists: { include: { discoverItems: true } };
    ownedLists: { include: { discoverItems: true } };
    savedDiscoverItems: true;
    completedDiscoverItems: true;
    discoverItems: true;
  };
}>;

export async function createUser(body: SignupSchema): ServerResponse<User> {
  try {
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message ?? ApiErrorType.BAD_REQUEST;

      return ResponseService.error({
        message: firstError,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { username: validationResult.data.username },
      select: { id: true },
    });

    if (existingUser) {
      return ResponseService.error({
        message: 'Username must be unique',
        status: HttpStatus.CONFLICT,
      });
    }

    const user = await prisma.user.create({
      data: {
        username: validationResult.data.username,
        passwordHash: hashPassword(validationResult.data.password),
      },
      include: {
        lists: { include: { discoverItems: true } },
        ownedLists: { include: { discoverItems: true } },
        savedDiscoverItems: true,
        completedDiscoverItems: true,
        discoverItems: true,
      },
    });

    return ResponseService.success({
      data: user,
      message: 'User created successfully',
      status: HttpStatus.CREATED,
    });
  } catch (error: unknown) {
    console.error('Error creating user:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getCurrentUser(): ServerResponse<CurrentUserResponse> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return ResponseService.error({
        message: ApiErrorType.UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lists: { include: { discoverItems: true } },
        ownedLists: { include: { discoverItems: true } },
        savedDiscoverItems: true,
        completedDiscoverItems: true,
        discoverItems: true,
      },
    });

    if (!user) {
      return ResponseService.error({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return ResponseService.success({
      data: user,
      message: 'User fetched successfully',
    });
  } catch (error: unknown) {
    console.error('Error fetching current user:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
