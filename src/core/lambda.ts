import { NextApiResponse, NextApiRequest } from 'next';
import { generateUrlFromMethods } from '../common/utils';

import { RequestMethod, findMethodAndParams } from '../common';
import { ClassType, DecoratorTarget } from '../common/interfaces';

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
      `The class ${Class?.name} does not have any method decorators https://err.sh/maxchehab/9ight/no-method-decorators-found`,
    );
  }

  return async (req: NextApiRequest | boolean, res: NextApiResponse) => {
    if (typeof req === 'boolean') {
      return lambda;
    }

    const requestMethod = req.method && req.method.toUpperCase();

    if (typeof requestMethod !== 'string') {
      return res.status(404).json({ message: 'Not found' });
    }

    const methods = lambda.__9ight__methods?.filter(
      ({ method }) => method === requestMethod,
    );

    const url = generateUrlFromMethods(methods, req.url);

    console.log({ url, methods, realUrl: req.url });

    const [method, params] = findMethodAndParams(url, methods);

    const property = method?.property;

    (req as any).params = params;

    console.log({ property, params });

    if (!property) {
      return res.status(404).json({ message: 'Not found' });
    }

    const args = new Array();

    const parameters = lambda.__9ight__methodParameters?.get(property) || [];

    for await (const param of parameters) {
      args[param.index] = await param.transform(req, res);
    }

    console.log({ args });

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

    return res.send(response);
  };
}
