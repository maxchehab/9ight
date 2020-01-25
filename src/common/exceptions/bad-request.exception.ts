import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message?: any) {
    super(400, 'Bad Request', message);
  }
}