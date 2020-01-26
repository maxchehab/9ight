import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as tsnode from 'ts-node';
import _eval from 'eval';

import { LambdaFunction } from './lambda';

interface RouteMap {
  source: string;
  destination: string;
}

export async function rewrites(): Promise<RouteMap[]> {
  const dir = process.cwd();
  const pagePath = path.join(dir, 'pages');
  const files = glob.sync(path.join(pagePath, 'api', '**/*.ts'));

  const compiler = tsnode.create();

  const configPath = compiler.ts.findConfigFile(dir, fileName =>
    fs.existsSync(fileName),
  );

  const config = require(configPath);
  config.compilerOptions.target = 'es5';
  config.compilerOptions.module = 'es5';

  const rewrites = new Array<RouteMap>();

  for await (const file of files) {
    const content = fs.readFileSync(file, { encoding: 'UTF8' });
    const { outputText } = compiler.ts.transpileModule(content, config);

    const lambdaFn: LambdaFunction = _eval(outputText, true).default;
    const lambda = await lambdaFn(true);

    if (!lambda) {
      continue;
    }

    const { __9ight__methods: methods } = lambda;

    const { dir, name } = path.parse(file);
    const fileName = name === 'index' ? '' : name;
    const destPath = path.join(dir, fileName);
    const destination = path.join('/', path.relative(pagePath, destPath));

    methods.forEach(method => {
      const source = path.join(
        '/',
        path.relative(pagePath, dir),
        fileName,
        method.path,
      );

      rewrites.push({ source, destination });
    });
  }

  return rewrites.reduce((routes, map) => {
    const exists = routes.find(
      ({ source, destination }) =>
        source === map.source && destination === map.destination,
    );

    if (!exists) {
      routes.push(map);
    }

    return routes;
  }, []);
}
