import { NextResponse } from 'next/server';

import type { ServerError } from '../utils/server-error';
import { ApiErrorType } from './types';

export function ErrorResponse(
  error: ServerError | Error | null,
  status: number,
): NextResponse {
  const message = error?.message ?? ApiErrorType.UNKNOWN_ERROR;

  return NextResponse.json({ error: message }, { status });
}

export function SuccessResponse<T>(data: T, status: number): NextResponse {
  return NextResponse.json(data, { status });
}
