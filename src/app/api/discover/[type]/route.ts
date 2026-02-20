import { DiscoverItemType } from '@generated/prisma/enums';

import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getDiscoverItemsByType } from '@/server/lib/discover';

type Params = {
  params: Promise<{ type: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { type } = await params;
    const { data, status } = await getDiscoverItemsByType(
      type as DiscoverItemType,
    );

    return SuccessResponse(data ?? [], status);
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
