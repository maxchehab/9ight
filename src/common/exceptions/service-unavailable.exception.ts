import { HttpException } from './http.exception';

export class ServiceUnavailableException extends HttpException {
  constructor(message?: any) {
    super(503, 'Service Unavailable', message);
  }
}