import { HttpException } from './http.exception';

export class TooManyRequestsException extends HttpException {
  constructor(message?: any) {
    super(429, 'Too Many Requests', message);
  }
}