import { ListSchema } from '@/lib/validators/list';
import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { createList, getUserLists } from '@/server/lib/lists';

export async function GET(_req: Request) {
  try {
    const { data, status, error } = await getUserLists();

    if (error) {
      return ErrorResponse(error, status);
    }

    return SuccessResponse(data, status);
  } catch (error: unknown) {
    console.error('Error fetching user lists:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
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

    return SuccessResponse(data, status);
  } catch (error: unknown) {
    console.error('Error adding item to list:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
