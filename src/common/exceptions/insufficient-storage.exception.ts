import { HttpException } from './http.exception';

export class InsufficientStorageException extends HttpException {
  constructor(message?: any) {
    super(507, 'Insufficient Storage', message);
  }
}