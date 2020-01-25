import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: any) {
    super(401, 'Unauthorized', message);
  }
}