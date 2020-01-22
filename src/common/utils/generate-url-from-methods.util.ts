import * as paths from 'path';
import * as urls from 'url';

import { Method } from '../interfaces';

export function generateUrlFromMethods(methods: Method[], url: string): string {
  if (!methods.length) {
    return url;
  }

  const maxSegmentLength = Math.max(
    ...methods.map(
      ({ path }) => path.replace(/^\/|\/$/g, '').split('/').length,
    ),
  );

  url = urls.parse(url).pathname;
  url = url.replace(/^\/|\/$/g, '');
  url = url
    .split('/')
    .slice(url.split('/').length - maxSegmentLength)
    .join('/');

  return paths.join('/', url);
}
