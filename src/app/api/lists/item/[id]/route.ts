import { NextResponse } from 'next/server';

import { ErrorResponse } from '@/server/http/error-response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getUserListsByDiscoverItemId } from '@/server/lib/lists';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, status, error } = await getUserListsByDiscoverItemId(id);

    if (error) {
      return ErrorResponse(error, status);
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Error fetching lists for item:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
