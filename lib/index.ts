import { NextApiResponse, NextApiRequest } from 'next';

export enum RequestMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

export function Get(): MethodDecorator {
  return function(target: DecoratorTarget, propertyKey: string | symbol) {
    if (!target.methods) {
      target.methods = new Map<RequestMethod, string>();
    }

    target.methods.set(RequestMethod.GET, propertyKey);
  };
}

export function Post(): MethodDecorator {
  return function(target: DecoratorTarget, propertyKey: string | symbol) {
    if (!target.methods) {
      target.methods = new Map<RequestMethod, string>();
    }

    target.methods.set(RequestMethod.POST, propertyKey);
  };
}

export interface DecoratorTarget {
  methods?: Map<string, string | symbol>;
}

export interface ClassType<t> {
  new (): t & DecoratorTarget;
}

export type LambdaFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>;

export function Lambda<t>(LambdaClass: ClassType<t>): LambdaFunction {
  const lambda = new LambdaClass();

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

    return (lambda as any)[property](req, res);
  };
}
