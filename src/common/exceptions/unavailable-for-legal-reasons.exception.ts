import { HttpException } from './http.exception';

export class UnavailableForLegalReasonsException extends HttpException {
  constructor(message?: any) {
    super(451, 'Unavailable For Legal Reasons', message);
  }
}