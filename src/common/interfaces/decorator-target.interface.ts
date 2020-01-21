import { Parameter } from './parameter.interface';
import { RequestMethod } from '../constants';

export interface DecoratorTarget {
  __9ight__methods?: Array<Method>;
  __9ight__methodParameters?: Map<string | symbol, Parameter[]>;
}

export interface Method {
  property: string | symbol;
  path: string;
  method: RequestMethod;
}
