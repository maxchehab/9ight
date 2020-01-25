import { HttpException } from './http.exception';

export class RequestURITooLongException extends HttpException {
  constructor(message?: any) {
    super(414, 'Request-URI Too Long', message);
  }
}
