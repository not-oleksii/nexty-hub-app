import { TrackingStatus } from '@generated/prisma/enums';

import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getUserTrackedItems } from '@/server/lib/discover';

const VALID_STATUSES = new Set<string>(Object.values(TrackingStatus));

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');

    const status =
      statusParam && VALID_STATUSES.has(statusParam)
        ? (statusParam as TrackingStatus)
        : undefined;

    const {
      data,
      status: resStatus,
      error,
    } = await getUserTrackedItems({
      status,
    });

    if (error) {
      return ErrorResponse(error, resStatus);
    }

    return SuccessResponse(data ?? [], resStatus);
  } catch (error: unknown) {
    console.error('Error fetching tracked items:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
