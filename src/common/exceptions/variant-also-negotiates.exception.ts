import { HttpException } from './http.exception';

export class VariantAlsoNegotiatesException extends HttpException {
  constructor(message?: any) {
    super(506, 'Variant Also Negotiates', message);
  }
}