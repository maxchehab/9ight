import { NextApiRequest, NextApiResponse } from 'next';

import {
  DecoratorTarget,
  Parameter,
  ParameterTransformer,
} from '../interfaces';
import { ParameterType } from '../constants';
import { BadRequestException } from '../exceptions/bad-request.exception';

type Validator = (input: any) => Promise<boolean>;

function createParameterMappingDecorator(
  type: ParameterType,
  transform: ParameterTransformer,
) {
  return function(
    target: DecoratorTarget,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    if (!target.__9ight__methodParameters) {
      target.__9ight__methodParameters = new Map<
        string | symbol,
        Parameter[]
      >();
    }

    const existingParameters: Parameter[] =
      target.__9ight__methodParameters.get(propertyKey) || [];

    existingParameters.push({
      index: parameterIndex,
      type,
      transform,
    });

    target.__9ight__methodParameters.set(propertyKey, existingParameters);
  };
}

/**
 * Request Query Decorator. Attaches the Request's query with an optional validator.
 */
export const Query = (validator?: Validator) =>
  createParameterMappingDecorator(
    ParameterType.QUERY,
    async (req: NextApiRequest) => {
      if (validator) {
        const valid = await validator(req.query);

        if (!valid) {
          throw new BadRequestException();
        }
      }

      return req.query || {};
    },
  );

/**
 * Request Body Decorator. Attaches the Request's body with an optional validator.
 */
export const Body = (validator?: Validator) =>
  createParameterMappingDecorator(
    ParameterType.BODY,
    async (req: NextApiRequest) => {
      if (validator) {
        const valid = await validator(req.body);

        if (!valid) {
          throw new BadRequestException();
        }
      }

      return req.body || {};
    },
  );

/**
 * Request Param Decorator. Attaches the path's interpolated parameters if available. Otherwise an empty object.
 */
export const Params = (validator?: Validator) =>
  createParameterMappingDecorator(
    ParameterType.PARAMS,
    async (req: NextApiRequest) => {
      if (validator) {
        const valid = await validator(req.query);

        if (!valid) {
          throw new BadRequestException();
        }
      }

      return (req as any).params || {};
    },
  );

/**
 * Request Decorator. Attaches the the raw Request.
 */
export const Req = () =>
  createParameterMappingDecorator(
    ParameterType.REQ,
    async (req: NextApiRequest) => {
      return req;
    },
  );

/**
 * Response Decorator. Attaches the raw Response.
 */
export const Res = () =>
  createParameterMappingDecorator(
    ParameterType.RES,
    async (_req: NextApiRequest, res: NextApiResponse) => {
      return res;
    },
  );
