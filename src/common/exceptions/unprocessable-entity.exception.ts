import { HttpException } from './http.exception';

export class UnprocessableEntityException extends HttpException {
  constructor(message?: any) {
    super(422, 'Unprocessable Entity', message);
  }
}