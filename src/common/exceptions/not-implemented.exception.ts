import { HttpException } from './http.exception';

export class NotImplementedException extends HttpException {
  constructor(message?: any) {
    super(501, 'Not Implemented', message);
  }
}