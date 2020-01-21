import { NextApiResponse, NextApiRequest } from 'next';

import { RequestMethod } from '../common';
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
      'Class provided to Lambda is missing Request Method decorators.',
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

    const { property } = lambda.__9ight__methods?.find(
      ({ method }) => method === requestMethod,
    );

    if (!property) {
      return res.status(404).json({ message: 'Not found' });
    }

    const args = new Array();

    const parameters = lambda.__9ight__methodParameters?.get(property);

    if (parameters) {
      for await (const param of parameters) {
        args[param.index] = await param.transform(req, res);
      }
    }

    const response = await (lambda as any)[property](...args);

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
