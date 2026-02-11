import { ApiSuccessMessage, HttpStatus } from '@/server/http/types';
import { ServerError } from '@/server/utils/server-error';

export type ResponseResult<T> = {
  data: T | null;
  status: HttpStatus;
  message?: string;
  error: ServerError | null;
};

type ErrorPayload = {
  message: string;
  status?: HttpStatus;
};

type SuccessPayload<T> = {
  data: T;
  message?: string;
  status?: HttpStatus;
};

export class ResponseService {
  static error<T = never>({
    message,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  }: ErrorPayload): ResponseResult<T> {
    return {
      data: null,
      status,
      message,
      error: new ServerError({ message }),
    };
  }

  static success<T>({
    data,
    message = ApiSuccessMessage.OK,
    status = HttpStatus.OK,
  }: SuccessPayload<T>): ResponseResult<T> {
    return { data, status, message, error: null };
  }
}

export type ServerResponse<T> = Promise<ResponseResult<T>>;
