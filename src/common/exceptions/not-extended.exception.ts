import { HttpException } from './http.exception';

export class NotExtendedException extends HttpException {
  constructor(message?: any) {
    super(510, 'Not Extended', message);
  }
}