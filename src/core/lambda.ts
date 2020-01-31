import { NextApiResponse, NextApiRequest } from 'next';
import { print, stringify } from 'q-i';

import { ClassType, DecoratorTarget } from '../common/interfaces';
import { generateUrlFromMethods } from '../common/utils';
import { HttpException } from '../common/exceptions/http.exception';
import { NotFoundException } from '../common/exceptions/not-found.exception';
import { RequestMethod, findMethodAndParams } from '../common';

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

  lambda.__9ight__isLambda = true;

  return async (req: NextApiRequest | boolean, res: NextApiResponse) => {
    const timestamp = new Date().toUTCString();
    const target = await executeRequest(req, res, lambda);

    if (typeof req === 'boolean') {
      return target;
    }

    const request = {
      url: req.url,
      method: req.method,
      headers: req.headers,
    };

    const response = {
      status: res.statusCode,
      headers: res.getHeaders(),
    };

    console.log(stringify({ timestamp, request, response }));
  };
}

async function executeRequest(
  req: NextApiRequest | boolean,
  res: NextApiResponse,
  lambda: DecoratorTarget,
) {
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
}
