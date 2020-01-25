import { HttpException } from './http.exception';

export class GatewayTimeoutException extends HttpException {
  constructor(message?: any) {
    super(504, 'Gateway Timeout', message);
  }
}