import { HttpException } from './http.exception';

export class ImATeapotException extends HttpException {
  constructor(message: any = 'The resulting message may be short and stout.') {
    super(418, `I'm a teapot`, message);
  }
}
