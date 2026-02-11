import { NextResponse } from 'next/server';

import { type SignupSchema } from '@/lib/validators/signup';
import { ErrorResponse } from '@/server/http/error-response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { createUser } from '@/server/lib/users';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignupSchema;
    const { data, status, error } = await createUser(body);

    if (error) {
      return ErrorResponse(error, status);
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
