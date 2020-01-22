import { generateUrlFromMethods } from '.';
import { Method } from '../interfaces';
import { RequestMethod } from '../constants';

describe('generateUrlFromMethods', () => {
  it('returns correct path with multiple methods and a trailing slash', () => {
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

    const url = '/api/user/123';
    const newUrl = generateUrlFromMethods(methods, url);

    expect(newUrl).toEqual('/user/123');
  });

  it('returns correct path with multiple methods of same length', () => {
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
        path: '/user',
        method: RequestMethod.GET,
      },
    ];

    const url = '/api/posts';
    const newUrl = generateUrlFromMethods(methods, url);

    expect(newUrl).toEqual('/posts');
  });

  it('returns correct path with multiple methods of varying length', () => {
    const methods: Method[] = [
      {
        property: 'get',
        path: '/posts/:id',
        method: RequestMethod.GET,
      },
      {
        property: 'get1',
        path: '/posts',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/posts/:id/comment',
        method: RequestMethod.GET,
      },
      {
        property: 'get2',
        path: '/posts/:id/comment/:id',
        method: RequestMethod.GET,
      },
    ];

    const url = '/api/posts/123/comment/321';
    const newUrl = generateUrlFromMethods(methods, url);

    expect(newUrl).toEqual('/posts/123/comment/321');
  });

  it('returns correct path with no methods', () => {
    const url = '/api/user/123';
    const newUrl = generateUrlFromMethods([], url);

    expect(newUrl).toEqual('/api/user/123');
  });
});
