import { NextApiResponse, NextApiRequest } from 'next';
import { generateUrlFromMethods } from '../common/utils';

import { ClassType, DecoratorTarget } from '../common/interfaces';
import { HttpException } from '../common/exceptions/http.exception';
import { RequestMethod, findMethodAndParams } from '../common';
import { NotFoundException } from '../common/exceptions/not-found.exception';

export type LambdaFunction = (
  req: NextApiRequest | boolean,
  res?: NextApiResponse,
) => Promise<void | DecoratorTarget>;

export function Lambda<t>(
  Class: ClassType<t & DecoratorTarget>,
): LambdaFunction {
  const lambda = new Class();

  if (!lambda.__9ight__methods) {
    throw new TypeError(
      `The class ${Class?.name} does not have any method decorators. https://err.sh/maxchehab/9ight/no-method-decorators-found`,
    );
  }

  return async (req: NextApiRequest | boolean, res: NextApiResponse) => {
    try {
      if (typeof req === 'boolean') {
        return lambda;
      }

      const requestMethod: string = req.method?.toUpperCase();
      const methods = lambda.__9ight__methods?.filter(
        ({ method }) => method === requestMethod,
      );

      const url = generateUrlFromMethods(methods, req.url);
      const [method, params] = findMethodAndParams(url, methods);
      const property = method?.property;
      (req as any).params = params;

      if (!property) {
        throw new NotFoundException();
      }

      const args = new Array();
      const parameters = lambda.__9ight__methodParameters?.get(property) || [];

      for await (const param of parameters) {
        args[param.index] = await param.transform(req, res);
      }

      const response = await (lambda as any)[property](...args);

      if (res.headersSent) {
        return;
      }

      let statusCode = 200;

      switch (requestMethod) {
        case RequestMethod.POST: {
          statusCode = 201;
          break;
        }
      }

      res.status(statusCode);

      if (typeof response === 'object') {
        return res.json(response);
      }

      return res.send(String(response));
    } catch (error) {
      console.trace(error);

      const exception: HttpException = error;

      if (exception.isHttpException) {
        return res
          .status(exception.statusCode)
          .json({ code: exception.code, message: exception.message });
      }

      return res.status(500).json({ code: 'Internal Server Error' });
    }
  };
}
