import { HttpException } from './http.exception';

export class FailedDependencyException extends HttpException {
  constructor(message?: any) {
    super(424, 'Failed Dependency', message);
  }
}