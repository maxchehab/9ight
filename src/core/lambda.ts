import { NextApiResponse, NextApiRequest } from 'next';

import { LambdaClass } from './interfaces';
import { RequestMethod } from '../common';

export type LambdaFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>;

export function Lambda<t>(Class: LambdaClass<t>): LambdaFunction {
  const lambda = new Class();

  if (!lambda.methods) {
    throw new TypeError(
      'Class provided to Lambda is missing Request Method decorators.',
    );
  }

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method && req.method.toUpperCase();

    if (typeof requestMethod !== 'string') {
      return res.status(404).json({ message: 'Not found' });
    }

    const property = lambda.methods && lambda.methods.get(requestMethod);

    if (!property) {
      return res.status(404).json({ message: 'Not found' });
    }

    const response = await (lambda as any)[property](req, res);

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
