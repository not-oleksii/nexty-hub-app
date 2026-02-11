'use server';

import { scryptSync, timingSafeEqual } from 'crypto';

import { prisma } from '@/server/db/prisma';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import {
  ResponseService,
  type ServerResponse,
} from '@/server/services/response-service';

function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(':');

  if (!salt || !expectedHex) {
    return false;
  }

  const actualHex = scryptSync(password, salt, 64).toString('hex');
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = Buffer.from(actualHex, 'hex');

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}

export async function login(
  username: string,
  password: string,
): ServerResponse<{ userId: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return ResponseService.error({
        message: 'Invalid username or password',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return ResponseService.error({
        message: 'Invalid username or password',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return ResponseService.success({
      data: { userId: user.id },
      message: 'Login successful',
    });
  } catch (error: unknown) {
    console.error('Login error:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function logout() {
  try {
    return ResponseService.success({
      data: null,
      message: 'Logout successful',
    });
  } catch (error: unknown) {
    console.error('Logout error:', error);

    return ResponseService.error({
      message: ApiErrorType.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
