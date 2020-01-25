import { HttpException } from './http.exception';

export class NotAcceptableException extends HttpException {
  constructor(message?: any) {
    super(406, 'Not Acceptable', message);
  }
}