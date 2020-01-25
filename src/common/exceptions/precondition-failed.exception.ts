import { HttpException } from './http.exception';

export class PreconditionFailedException extends HttpException {
  constructor(message?: any) {
    super(412, 'Precondition Failed', message);
  }
}