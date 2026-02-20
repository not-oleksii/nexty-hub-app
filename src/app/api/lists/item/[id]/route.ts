import { ErrorResponse, SuccessResponse } from '@/server/http/response';
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

    return SuccessResponse(data, status);
  } catch (error: unknown) {
    console.error('Error fetching lists for item:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
