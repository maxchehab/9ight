import { HttpException } from './http.exception';

export class ExpectationFailedException extends HttpException {
  constructor(message?: any) {
    super(417, 'Expectation Failed', message);
  }
}