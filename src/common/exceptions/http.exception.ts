export class HttpException {
  readonly isHttpException: undefined | true = true;

  constructor(
    readonly statusCode: number,
    readonly code: string,
    readonly message?: any,
  ) {}
}
