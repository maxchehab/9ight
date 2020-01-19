import { RequestMethod } from '../constants';

export interface DecoratorTarget {
  methods?: Map<string, string | symbol>;
}

function createRequestMappingDecorator(method: RequestMethod) {
  return function(): MethodDecorator {
    return function(target: DecoratorTarget, propertyKey: string | symbol) {
      if (!target.methods) {
        target.methods = new Map<RequestMethod, string>();
      }

      target.methods.set(method, propertyKey);
    };
  };
}

/**
 * Route handler (method) Decorator. Routes HTTP CONNECT requests to the specified path.
 */
export const Connect = createRequestMappingDecorator(RequestMethod.CONNECT);

/**
 * Route handler (method) Decorator. Routes HTTP DELETE requests to the specified path.
 */
export const Delete = createRequestMappingDecorator(RequestMethod.DELETE);

/**
 * Route handler (method) Decorator. Routes HTTP GET requests to the specified path.
 */
export const Get = createRequestMappingDecorator(RequestMethod.GET);

/**
 * Route handler (method) Decorator. Routes HTTP HEAD requests to the specified path.
 */
export const Head = createRequestMappingDecorator(RequestMethod.HEAD);

/**
 * Route handler (method) Decorator. Routes HTTP OPTIONS requests to the specified path.
 */
export const Options = createRequestMappingDecorator(RequestMethod.OPTIONS);

/**
 * Route handler (method) Decorator. Routes HTTP PATCH requests to the specified path.
 */
export const Patch = createRequestMappingDecorator(RequestMethod.PATCH);

/**
 * Route handler (method) Decorator. Routes HTTP POST requests to the specified path.
 */
export const Post = createRequestMappingDecorator(RequestMethod.POST);

/**
 * Route handler (method) Decorator. Routes HTTP PUT requests to the specified path.
 */
export const Put = createRequestMappingDecorator(RequestMethod.PUT);

/**
 * Route handler (method) Decorator. Routes HTTP TRACE requests to the specified path.
 */
export const Trace = createRequestMappingDecorator(RequestMethod.TRACE);
