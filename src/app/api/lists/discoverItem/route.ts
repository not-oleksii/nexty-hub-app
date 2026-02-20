import { ListVisibility } from '@generated/prisma/enums';

import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { addOrRemoveDiscoverItemToList, createList } from '@/server/lib/lists';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listId, discoverItemId } = body;

    if (!listId) {
      const newList = await createList({
        name: 'My List',
        description: undefined,
        coverImageUrl: undefined,
        tags: [],
        memberIds: [],
        discoverItemIds: [],
        visibility: ListVisibility.PRIVATE,
      });

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

      return SuccessResponse(data, status);
    }

    const { data, status, error } = await addOrRemoveDiscoverItemToList(
      listId,
      discoverItemId,
    );

    if (error) {
      return ErrorResponse(error, status);
    }

    return SuccessResponse(data, status);
  } catch (err: unknown) {
    console.error('Error adding item to list:', err);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
