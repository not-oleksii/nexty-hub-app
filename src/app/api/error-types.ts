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
