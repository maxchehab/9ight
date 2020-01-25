import { HttpException } from './http.exception';

export class LoopDetectedException extends HttpException {
  constructor(message?: any) {
    super(508, 'Loop Detected', message);
  }
}