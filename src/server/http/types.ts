export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ApiSuccessMessage {
  OK = 'OK',
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  VALIDATED = 'VALIDATED',
  AUTHORIZED = 'AUTHORIZED',
}

export enum ApiErrorType {
  UNKNOWN_ERROR = 'Something went wrong. Please try again later.',
  INTERNAL_SERVER_ERROR = 'Internal Server Error. Please try again later.',
  BAD_REQUEST = 'Bad Request. Please check your request and try again.',
  UNAUTHORIZED = 'Unauthorized. Please login to continue.',
  FORBIDDEN = 'Forbidden. You are not authorized to access this resource.',
  NOT_FOUND = 'Not Found. The requested resource was not found.',
  CONFLICT = 'Conflict. The request could not be completed due to a conflict with the current state of the resource.',
  TOO_MANY_REQUESTS = 'Too Many Requests. Please try again later.',
  SERVICE_UNAVAILABLE = 'Service Unavailable. The server is currently unable to handle the request.',
}
