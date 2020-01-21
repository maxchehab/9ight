import { DecoratorTarget, Method } from '../interfaces';
import { RequestMethod } from '../constants';

function createMethodMappingDecorator(method: RequestMethod) {
  return function(path?: string): MethodDecorator {
    return function(target: DecoratorTarget, property: string | symbol) {
      if (!target.__9ight__methods) {
        target.__9ight__methods = new Array<Method>();
      }

      target.__9ight__methods.push({ property, path, method });
    };
  };
}

/**
 * Route handler (method) Decorator. Routes HTTP CONNECT requests to the specified function.
 */
export const Connect = createMethodMappingDecorator(RequestMethod.CONNECT);

/**
 * Route handler (method) Decorator. Routes HTTP DELETE requests to the specified function.
 */
export const Delete = createMethodMappingDecorator(RequestMethod.DELETE);

/**
 * Route handler (method) Decorator. Routes HTTP GET requests to the specified function.
 */
export const Get = createMethodMappingDecorator(RequestMethod.GET);

/**
 * Route handler (method) Decorator. Routes HTTP HEAD requests to the specified function.
 */
export const Head = createMethodMappingDecorator(RequestMethod.HEAD);

/**
 * Route handler (method) Decorator. Routes HTTP OPTIONS requests to the specified function.
 */
export const Options = createMethodMappingDecorator(RequestMethod.OPTIONS);

/**
 * Route handler (method) Decorator. Routes HTTP PATCH requests to the specified function.
 */
export const Patch = createMethodMappingDecorator(RequestMethod.PATCH);

/**
 * Route handler (method) Decorator. Routes HTTP POST requests to the specified function.
 */
export const Post = createMethodMappingDecorator(RequestMethod.POST);

/**
 * Route handler (method) Decorator. Routes HTTP PUT requests to the specified function.
 */
export const Put = createMethodMappingDecorator(RequestMethod.PUT);

/**
 * Route handler (method) Decorator. Routes HTTP TRACE requests to the specified function.
 */
export const Trace = createMethodMappingDecorator(RequestMethod.TRACE);
