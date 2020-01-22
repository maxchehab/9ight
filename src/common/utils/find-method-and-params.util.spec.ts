import { findMethodAndParams } from '.';
import { Method } from '../interfaces';
import { RequestMethod } from '../constants';

describe('findMethodAndParams', () => {
  it('returns correct method and parameter with multiple routes', () => {
    const methods: Method[] = [
      {
        property: 'get',
        path: '/comment',
        method: RequestMethod.GET,
      },
      {
        property: 'get1',
        path: '/posts',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/another',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/user/:id',
        method: RequestMethod.GET,
      },
    ];

    const url = '/user/123';
    const [method, params] = findMethodAndParams(url, methods);

    expect(method.property).toEqual('get2');
    expect(params.id).toEqual('123');
  });

  it('returns no method and empty params with no match', () => {
    const methods: Method[] = [
      {
        property: 'get',
        path: '/comment',
        method: RequestMethod.GET,
      },
      {
        property: 'get1',
        path: '/posts',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/another',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/user/:id',
        method: RequestMethod.GET,
      },
    ];

    const url = '/invalid';
    const [method, params] = findMethodAndParams(url, methods);

    expect(method).toBeUndefined();
    expect(params).toEqual({});
  });

  it('returns multiple params with multi-param path', () => {
    const methods: Method[] = [
      {
        property: 'get',
        path: '/post/:post_id/comment/:comment_id',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/user/:id',
        method: RequestMethod.GET,
      },
    ];

    const url = '/post/123/comment/321';
    const [method, params] = findMethodAndParams(url, methods);

    expect(method.property).toEqual('get');
    expect(params).toEqual({ post_id: '123', comment_id: '321' });
  });
});
