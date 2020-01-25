import { HttpException } from './http.exception';

export class PayloadTooLargeException extends HttpException {
  constructor(message?: any) {
    super(413, 'Payload Too Large', message);
  }
}