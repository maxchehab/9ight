import { HttpException } from './http.exception';

export class PaymentRequiredException extends HttpException {
  constructor(message?: any) {
    super(402, 'Payment Required', message);
  }
}