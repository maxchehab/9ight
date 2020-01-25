import { HttpException } from './http.exception';

export class BadGatewayException extends HttpException {
  constructor(message?: any) {
    super(502, 'Bad Gateway', message);
  }
}