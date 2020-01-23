import { Lambda } from '.';
import { Get } from '../common';

describe('Lambda', () => {
  it('throws a no-method-decorators error when a class does not have any method decorators', async () => {
    class Users {
      list(): string[] {
        return ['all', 'of', 'the', 'users'];
      }
    }

    expect(() => Lambda(Users)).toThrowErrorMatchingSnapshot();
  });

  it('does not throw a no-method-decorators error when a class contains a method decorator', async () => {
    class Users {
      @Get()
      list(): string[] {
        return ['all', 'of', 'the', 'users'];
      }
    }

    expect(() => Lambda(Users)).not.toThrow();
  });
});
