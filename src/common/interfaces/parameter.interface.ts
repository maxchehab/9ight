import { NextApiRequest, NextApiResponse } from 'next';

import { ParameterType } from '../constants';

export interface Parameter {
  index: number;
  type: ParameterType;
  transform: ParameterTransformer;
}

export type ParameterTransformer = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>;
