import { HttpException } from './http.exception';

export class HTTPVersionNotSupportedException extends HttpException {
  constructor(message?: any) {
    super(505, 'HTTP Version Not Supported', message);
  }
}