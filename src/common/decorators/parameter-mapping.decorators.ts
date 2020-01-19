import { NextApiRequest, NextApiResponse } from 'next';

import {
  DecoratorTarget,
  Parameter,
  ParameterTransformer,
} from '../interfaces';
import { ParameterType } from '../constants';

type Validator = (input: {
  [key: string]: string | string[];
}) => Promise<boolean>;

function createParameterMappingDecorator(
  type: ParameterType,
  transform: ParameterTransformer,
) {
  return function(
    target: DecoratorTarget,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    if (!target.methodParameters) {
      target.methodParameters = new Map<string | symbol, Parameter[]>();
    }

    const existingParameters: Parameter[] =
      target.methodParameters.get(propertyKey) || [];

    existingParameters.push({
      index: parameterIndex,
      type,
      transform,
    });

    target.methodParameters.set(propertyKey, existingParameters);
  };
}

export const Query = (validator?: Validator) =>
  createParameterMappingDecorator(
    ParameterType.QUERY,
    async (req: NextApiRequest) => {
      if (validator) {
        const valid = await validator(req.query);

        if (!valid) {
          // TODO Throw a BAD_REQUEST
          throw Error('bad request');
        }
      }

      return req.query || {};
    },
  );

export const Body = (validator?: Validator) =>
  createParameterMappingDecorator(
    ParameterType.BODY,
    async (req: NextApiRequest) => {
      if (validator) {
        const valid = await validator(req.body);

        if (!valid) {
          // TODO Throw a BAD_REQUEST
          throw Error('bad request');
        }
      }

      return req.body || {};
    },
  );

export const Req = () =>
  createParameterMappingDecorator(
    ParameterType.REQ,
    async (req: NextApiRequest) => {
      return req;
    },
  );

export const Res = () =>
  createParameterMappingDecorator(
    ParameterType.RES,
    async (_req: NextApiRequest, res: NextApiResponse) => {
      return res;
    },
  );
