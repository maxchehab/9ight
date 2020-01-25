import { HttpException } from './http.exception';

export class NetworkConnectTimeoutErrorException extends HttpException {
  constructor(message?: any) {
    super(599, 'Network Connect Timeout Error', message);
  }
}