import { HttpException } from './http.exception';

export class LengthRequiredException extends HttpException {
  constructor(message?: any) {
    super(411, 'Length Required', message);
  }
}