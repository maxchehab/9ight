import { Method } from '..';
import { pathToRegexp, Key } from 'path-to-regexp';

interface Params {
  [key: string]: string;
}

function match(url: string, path: string): Params | void {
  const keys = new Array<Key>();
  const regex = pathToRegexp(path, keys);
  const values = regex.exec(url);

  if (values) {
    return valuesToParams(values.slice(1), keys);
  }
}

function valuesToParams(values: string[], keys: Key[]) {
  return values.reduce((params, val, i) => {
    if (val === undefined) return params;
    return Object.assign(params, {
      [keys[i].name]: decodeURIComponent(val),
    });
  }, {});
}

export function findMethodAndParams(
  url: string,
  methods: Method[],
): [Method, Params] {
  let params = {};

  const method = methods.find(({ path }) => {
    const p = match(url, path);

    if (p) {
      params = p;
      return true;
    }
  });

  return [method, params];
}
