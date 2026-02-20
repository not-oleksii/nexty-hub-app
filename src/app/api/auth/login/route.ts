import { AUTH_COOKIE_NAME } from '@/server/auth/session';
import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { login } from '@/server/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const { error, status, message, data } = await login(username, password);

    if (error) {
      return ErrorResponse(error, status);
    }

    if (!data) {
      return ErrorResponse(new Error(ApiErrorType.BAD_REQUEST), status);
    }

    const response = SuccessResponse({ message }, status);

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.userId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
