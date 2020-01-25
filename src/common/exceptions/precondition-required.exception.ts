import { HttpException } from './http.exception';

export class PreconditionRequiredException extends HttpException {
  constructor(message?: any) {
    super(428, 'Precondition Required', message);
  }
}