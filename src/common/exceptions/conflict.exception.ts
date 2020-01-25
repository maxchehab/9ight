import { HttpException } from './http.exception';

export class ConflictException extends HttpException {
  constructor(message?: any) {
    super(409, 'Conflict', message);
  }
}