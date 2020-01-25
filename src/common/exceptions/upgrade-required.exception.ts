import { HttpException } from './http.exception';

export class UpgradeRequiredException extends HttpException {
  constructor(message?: any) {
    super(426, 'Upgrade Required', message);
  }
}