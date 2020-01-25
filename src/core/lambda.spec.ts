import axios from 'axios';
import closeServer from 'close-server';
import listen from 'test-listen';

import { Get, Query, Params, Req, Res, Post } from '../common';
import { Lambda } from '.';
import createTestServer from '../../test/create-test-server';
import { NextApiRequest, NextApiResponse } from 'next';

describe('Lambda', () => {
  beforeAll(() => {
    axios.defaults.validateStatus = () => true;
  });

  it('throws a no-method-decorators error when a class does not have any method decorators', () => {
    class Users {
      list(): string[] {
        return ['all', 'of', 'the', 'users'];
      }
    }

    expect(() => Lambda(Users)).toThrowErrorMatchingSnapshot();
  });

  it('does not throw a no-method-decorators error when a class contains a method decorator', () => {
    class Users {
      @Get()
      list(): string[] {
        return ['all', 'of', 'the', 'users'];
      }
    }

    expect(() => Lambda(Users)).not.toThrow();
  });

  it('returns instance of class when providing just a true boolean parameter', async () => {
    class Users {
      @Get()
      list(): string[] {
        return ['all', 'of', 'the', 'users'];
      }
    }

    const lambda = Lambda(Users);
    const classInstance = await lambda(true);

    expect(classInstance).toEqual(new Users());
  });

  it('throws a 404 NOT_FOUND when no methods match the url', async () => {
    class Users {
      @Get()
      list(): string[] {
        return ['all', 'of', 'the', 'users'];
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data } = await axios.get(url.concat('/invalid'));

    expect(status).toEqual(404);
    expect(data).toEqual({ code: 'Not Found' });

    await closeServer(server);
  });

  it('correctly applies single method argument', async () => {
    class Users {
      @Get('/user/:id')
      list(@Params() params: any) {
        return { params };
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data } = await axios.get(url.concat('/user/123?foo=bar'));

    expect(status).toEqual(200);
    expect(data).toEqual({ params: { id: '123' } });

    await closeServer(server);
  });

  it('correctly applies multiple method arguments', async () => {
    class Users {
      @Get('/user/:id')
      list(@Query() query: any, @Params() params: any) {
        return { query, params };
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data } = await axios.get(url.concat('/user/123?foo=bar'));

    expect(status).toEqual(200);
    expect(data).toEqual({ params: { id: '123' }, query: { foo: 'bar' } });

    await closeServer(server);
  });

  it('does update status code or touch response body if method sends request', async () => {
    class Users {
      @Get()
      list(@Res() res: NextApiResponse) {
        return res.status(600).json({ message: 'Sent from method' });
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data } = await axios.get(url);

    expect(status).toEqual(600);
    expect(data).toEqual({ message: 'Sent from method' });

    await closeServer(server);
  });

  it('returns a 201 for POST requests', async () => {
    class Users {
      @Post()
      create() {
        return { message: 'created' };
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data } = await axios.post(url);

    expect(status).toEqual(201);
    expect(data).toEqual({ message: 'created' });

    await closeServer(server);
  });

  it('serializes response as JSON if method returns an object', async () => {
    class Users {
      @Post()
      create() {
        return { message: 'created' };
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data, headers } = await axios.post(url);

    expect(status).toEqual(201);
    expect(data).toEqual({ message: 'created' });
    expect(headers['content-type']).toMatch(/application\/json;/);
    await closeServer(server);
  });

  it('serializes response as text if method returns a string', async () => {
    class Users {
      @Get()
      create() {
        return 'hello world';
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data, headers } = await axios.get(url);

    expect(status).toEqual(200);
    expect(data).toEqual('hello world');
    expect(headers['content-type']).toBeUndefined;
    await closeServer(server);
  });

  it('serializes response as text if method returns a boolean', async () => {
    class Users {
      @Get()
      create() {
        return true;
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data, headers } = await axios.get(url);

    expect(status).toEqual(200);
    expect(data).toEqual(true);
    expect(headers['content-type']).toBeUndefined;
    await closeServer(server);
  });

  it('serializes response as text if method returns a date', async () => {
    class Users {
      @Get()
      create() {
        return new Date(0);
      }
    }

    const server = createTestServer(Lambda(Users));
    const url = await listen(server);

    const { status, data, headers } = await axios.get(url);

    expect(status).toEqual(200);
    expect(data).toEqual('1970-01-01T00:00:00.000Z');
    expect(headers['content-type']).toBeUndefined;
    await closeServer(server);
  });
});
