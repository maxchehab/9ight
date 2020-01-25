import { HttpException } from './http.exception';

export class UnsupportedMediaTypeException extends HttpException {
  constructor(message?: any) {
    super(415, 'Unsupported Media Type', message);
  }
}