import { NextResponse } from 'next/server';

import { ErrorResponse } from '@/server/http/error-response';
import { ApiErrorType } from '@/server/http/types';
import { addOrRemoveDiscoverItemToList, createList } from '@/server/lib/lists';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listId, discoverItemId } = body;

    if (!listId) {
      const newList = await createList({ name: 'My List' });

      if (newList.error || !newList.data?.id) {
        return ErrorResponse(newList.error, newList.status);
      }

      const { data, status, error } = await addOrRemoveDiscoverItemToList(
        newList.data.id,
        discoverItemId,
      );

      if (error) {
        return ErrorResponse(error, status);
      }

      return NextResponse.json(data, { status });
    }

    const { data, status, error } = await addOrRemoveDiscoverItemToList(
      listId,
      discoverItemId,
    );

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
