import { HttpException } from './http.exception';

export class MethodNotAllowedException extends HttpException {
  constructor(message?: any) {
    super(405, 'Method Not Allowed', message);
  }
}