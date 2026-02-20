import { type DiscoverItemSchema } from '@/lib/validators/discovery-item';
import { ErrorResponse, SuccessResponse } from '@/server/http/response';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { createDiscoverItem } from '@/server/lib/discover';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DiscoverItemSchema;
    const { data, status, error } = await createDiscoverItem(body);

    if (error) {
      return ErrorResponse(error, status);
    }

    return SuccessResponse(data, status);
  } catch (err: unknown) {
    console.error('Error creating item:', err);

    return ErrorResponse(
      new Error(ApiErrorType.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
