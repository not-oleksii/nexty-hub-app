import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getDiscoverItems } from '@/server/lib/discover';

export async function GET() {
  try {
    const { data, status } = await getDiscoverItems();

    return SuccessResponse(data ?? [], status);
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
