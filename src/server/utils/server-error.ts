type ServerErrorParams = {
  message: string;
  code?: string;
  cause?: unknown;
};

export class ServerError extends Error {
  readonly code?: string;

  constructor({ message, code, cause }: ServerErrorParams) {
    super(message, { cause });
    this.name = 'ServerError';
    this.code = code;
  }
}

export function isServerError(error: unknown): error is ServerError {
  return error instanceof ServerError;
}
