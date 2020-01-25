import { HttpException } from './http.exception';

export class RequestHeaderFieldsTooLargeException extends HttpException {
  constructor(message?: any) {
    super(431, 'Request Header Fields Too Large', message);
  }
}