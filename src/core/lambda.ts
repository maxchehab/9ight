import { NextApiResponse, NextApiRequest } from 'next';
import { pathToRegexp, Key } from 'path-to-regexp';
import * as path from 'path';

import { RequestMethod } from '../common';
import { ClassType, DecoratorTarget, Method } from '../common/interfaces';

export type LambdaFunction = (
  req: NextApiRequest | boolean,
  res?: NextApiResponse,
) => Promise<void | DecoratorTarget>;

interface Params {
  [key: string]: string;
}

function generateUrlFromMethods(methods: Method[], url: string) {
  const maxSegmentLength = Math.max(
    ...methods.map(
      ({ path }) => path.replace(/^\/|\/$/g, '').split('/').length,
    ),
  );

  url = url
    .replace(/^\/|\/$/g, '')
    .split('/')
    .slice(maxSegmentLength + 1)
    .join('/');

  return path.join('/', url);
}

function match(url: string, path: string): Params | void {
  const keys = new Array<Key>();
  const regex = pathToRegexp(path, keys);
  const values = regex.exec(url);

  if (values) {
    return valuesToParams(values.slice(1), keys);
  }
}

function findMethodAndParams(url: string, methods: Method[]): [Method, Params] {
  let params = {};

  const method = methods.find(({ path }) => {
    const p = match(url, path);

    if (p) {
      params = p;
      return true;
    }
  });

  return [method, params];
}

function valuesToParams(values: string[], keys: Key[]) {
  return values.reduce((params, val, i) => {
    if (val === undefined) return params;
    return Object.assign(params, {
      [keys[i].name]: decodeURIComponent(val),
    });
  }, {});
}

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
