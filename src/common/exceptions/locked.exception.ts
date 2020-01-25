import { HttpException } from './http.exception';

export class LockedException extends HttpException {
  constructor(message?: any) {
    super(423, 'Locked', message);
  }
}