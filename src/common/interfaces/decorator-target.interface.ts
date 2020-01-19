import { Parameter } from './parameter.interface';

export interface DecoratorTarget {
  methods?: Map<string, string | symbol>;
  methodParameters?: Map<string | symbol, Parameter[]>;
}
