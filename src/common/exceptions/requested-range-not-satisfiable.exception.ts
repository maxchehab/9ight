import { HttpException } from './http.exception';

export class RequestedRangeNotSatisfiableException extends HttpException {
  constructor(message?: any) {
    super(416, 'Requested Range Not Satisfiable', message);
  }
}