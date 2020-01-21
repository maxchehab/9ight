import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as tsnode from 'ts-node';
import * as _eval from 'eval';

import { LambdaFunction } from './lambda';

export async function rewrites() {
  const dir = process.cwd();
  console.log({ dir });
  const apiPath = path.join(dir, 'pages', 'api', '**/*.ts');

  const files = glob.sync(apiPath);

  const compiler = tsnode.create();

  const configPath = compiler.ts.findConfigFile(dir, fileName =>
    fs.existsSync(fileName),
  );

  const config = require(configPath);
  config.compilerOptions.target = 'es5';
  config.compilerOptions.module = 'es5';

  for (const file of files) {
    const content = fs.readFileSync(file, { encoding: 'UTF8' });
    const { outputText } = compiler.ts.transpileModule(content, config);

    const lambdaFn: LambdaFunction = _eval(outputText, true).default;
    const lambda = await lambdaFn(true);

    if (!lambda) {
      continue;
    }

    const { __9ight__methods: methods } = lambda;

    console.log(methods);
  }

  return [];
}
