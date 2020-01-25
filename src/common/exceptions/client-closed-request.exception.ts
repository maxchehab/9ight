import { HttpException } from './http.exception';

export class ClientClosedRequestException extends HttpException {
  constructor(message?: any) {
    super(499, 'Client Closed Request', message);
  }
}