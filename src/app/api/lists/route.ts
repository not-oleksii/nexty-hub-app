import { NextResponse } from 'next/server';

import { ListSchema } from '@/lib/validators/list';
import { ErrorResponse } from '@/server/http/error-response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { createList, getUserLists } from '@/server/lib/lists';

export async function GET(_req: Request) {
  try {
    const { data, status, error } = await getUserLists();

    if (error) {
      return ErrorResponse(error, status);
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Error fetching user lists:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, status, error } = await createList(body as ListSchema);

    if (error) {
      return ErrorResponse(error, status);
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Error adding item to list:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
