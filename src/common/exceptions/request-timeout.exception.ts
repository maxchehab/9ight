import { HttpException } from './http.exception';

export class RequestTimeoutException extends HttpException {
  constructor(message?: any) {
    super(408, 'Request Timeout', message);
  }
}