import { HttpException } from './http.exception';

export class ConnectionClosedWithoutResponseException extends HttpException {
  constructor(message?: any) {
    super(444, 'Connection Closed Without Response', message);
  }
}