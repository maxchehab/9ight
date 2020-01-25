import { HttpException } from './http.exception';

export class NetworkAuthenticationRequiredException extends HttpException {
  constructor(message?: any) {
    super(511, 'Network Authentication Required', message);
  }
}