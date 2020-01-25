import { HttpException } from './http.exception';

export class ForbiddenException extends HttpException {
  constructor(message?: any) {
    super(403, 'Forbidden', message);
  }
}