import { AUTH_COOKIE_NAME } from '@/server/auth/session';
import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';

export async function POST() {
  try {
    const response = SuccessResponse({ message: 'Logged out' }, HttpStatus.OK);

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error logging out:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
