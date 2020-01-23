import { apiResolver } from 'next-server/dist/server/api-utils';
import http from 'http';

import { LambdaFunction } from '../src/core';

export default function createTestServer(route: LambdaFunction) {
  return http.createServer((req: any, res: any) =>
    apiResolver(req, res, undefined, route),
  );
}
