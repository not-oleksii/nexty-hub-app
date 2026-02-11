import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ApiErrorType } from '@/server/http/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown | unknown[]): string {
  if (error instanceof Error) {
    return error.message || ApiErrorType.UNKNOWN_ERROR;
  }

  if (Array.isArray(error)) {
    const messages = error.map((e) =>
      e instanceof Error ? e.message : String(e),
    );

    return messages.filter(Boolean).join(', ') || ApiErrorType.UNKNOWN_ERROR;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message?: unknown }).message;

    return typeof msg === 'string' ? msg : ApiErrorType.UNKNOWN_ERROR;
  }

  return ApiErrorType.UNKNOWN_ERROR;
}
