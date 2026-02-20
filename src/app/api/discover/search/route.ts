import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { searchDiscoverItems } from '@/server/lib/discover';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') ?? '';
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '20', 10) || 20,
      50,
    );

    const { data, status, error } = await searchDiscoverItems(query, limit);

    if (error) {
      return ErrorResponse(error, status);
    }

    return SuccessResponse(data ?? [], status);
  } catch (error: unknown) {
    console.error('Error searching discover items:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
