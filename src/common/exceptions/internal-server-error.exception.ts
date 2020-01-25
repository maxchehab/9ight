import { HttpException } from './http.exception';

export class InternalServerErrorException extends HttpException {
  constructor(message?: any) {
    super(500, 'Internal Server Error', message);
  }
}