import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getAcceptedFriends } from '@/server/lib/friends';

export async function GET() {
  try {
    const { data, status, error } = await getAcceptedFriends();

    if (error) {
      return ErrorResponse(error, status);
    }

    return SuccessResponse(data ?? [], status);
  } catch (error: unknown) {
    console.error('Error fetching friends:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
