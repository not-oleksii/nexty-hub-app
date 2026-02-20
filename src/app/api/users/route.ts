import { type SignupSchema } from '@/lib/validators/signup';
import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { createUser } from '@/server/lib/users';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignupSchema;
    const { data, status, error } = await createUser(body);

    if (error) {
      return ErrorResponse(error, status);
    }

    return SuccessResponse(data, status);
  } catch (error: unknown) {
    console.error('Registration error:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
