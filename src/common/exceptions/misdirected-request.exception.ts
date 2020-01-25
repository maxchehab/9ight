import { HttpException } from './http.exception';

export class MisdirectedRequestException extends HttpException {
  constructor(message?: any) {
    super(421, 'Misdirected Request', message);
  }
}