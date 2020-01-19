import { DecoratorTarget } from '../../common/decorators/request-mapping.decorators';

export interface LambdaClass<t> {
  new (): t & DecoratorTarget;
}
