import { NextResponse } from 'next/server';

import { ErrorResponse } from '@/server/http/error-response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getCurrentUser } from '@/server/lib/users';

export async function GET() {
  try {
    const { data, status, error } = await getCurrentUser();

    if (error) {
      return ErrorResponse(error, status);
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Error fetching current user:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
