import { HttpException } from './http.exception';

export class ProxyAuthenticationRequiredException extends HttpException {
  constructor(message?: any) {
    super(407, 'Proxy Authentication Required', message);
  }
}