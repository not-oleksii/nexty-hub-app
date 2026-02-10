import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ApiErrorType } from '@/app/api/error-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown | unknown[]): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof Array) {
    return error.map((error) => error.message).join(', ');
  }

  return ApiErrorType.UNKNOWN_ERROR;
}
