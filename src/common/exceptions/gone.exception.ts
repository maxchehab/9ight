import { HttpException } from './http.exception';

export class GoneException extends HttpException {
  constructor(message?: any) {
    super(410, 'Gone', message);
  }
}