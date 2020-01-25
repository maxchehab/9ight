import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message?: any) {
    super(404, 'Not Found', message);
  }
}