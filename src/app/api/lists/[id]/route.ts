import { NextResponse } from 'next/server';

import { ErrorResponse } from '@/server/http/error-response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { addOrRemoveDiscoverItemToList } from '@/server/lib/lists';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { itemId: string };
    const { data, status, error } = await addOrRemoveDiscoverItemToList(
      id,
      body.itemId,
    );

    if (error) {
      return ErrorResponse(error, status);
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Error adding item to list:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
