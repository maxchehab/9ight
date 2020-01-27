import build from 'next/dist/build';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import sinon from 'sinon';

import { DecoratorTarget } from '../common';
import { LambdaFunction } from './lambda';

interface RouteMap {
  source: string;
  destination: string;
}

const log = (...args: any) =>
  console.log(
    chalk.bold(chalk.green('9ight')).concat(':'),
    chalk.bold(...args),
  );

export async function rewrites(): Promise<RouteMap[]> {
  const nightPath = path.resolve(process.cwd(), '.next', '9ight');
  const lockPath = path.resolve(nightPath, 'BUILDING');

  if (await fs.pathExists(lockPath)) {
    return [];
  }

  try {
    if (!(await fs.pathExists(nightPath))) {
      await fs.mkdirp(nightPath);
    }

    fs.writeFileSync(lockPath, '1', { encoding: 'utf8' });

    log('Generating temporary build');
    const stdoutStub = sinon.stub(process.stdout, 'write');

    await build(process.cwd(), {
      distDir: path.relative(process.cwd(), nightPath),
    } as null);
    stdoutStub.restore();
    log('Parsing build directory');

    const rewrites = [];

    const pageManifestPath = path.resolve(
      nightPath,
      'server',
      'pages-manifest.json',
    );

    const buildIDPath = path.resolve(nightPath, 'BUILD_ID');

    if (!fs.existsSync(pageManifestPath) || !fs.existsSync(buildIDPath)) {
      throw new Error(
        'Could not find build artifacts. Your project may have failed to build!',
      );
    }

    const buildID: string = fs.readFileSync(buildIDPath, {
      encoding: 'UTF8',
    });

    const staticPageDirectory = path.resolve(
      nightPath,
      'server',
      'static',
      buildID,
      'pages',
    );

    const manifest = await fs.readJson(pageManifestPath);

    log('Generating rewrites');

    for (const key in manifest) {
      const file = path.resolve(nightPath, 'server', manifest[key]);

      if (!path.extname(file).match(/.js$/)) {
        continue;
      }

      const lambdaFn: LambdaFunction = require(file).default;
      let lambda: DecoratorTarget | void;

      try {
        lambda = await lambdaFn(true);

        if (!lambda || !lambda.__9ight__isLambda) {
          continue;
        }
      } catch {
        continue;
      }

      const { __9ight__methods: methods } = lambda;

      const { dir, name } = path.parse(file);
      const fileName = name === 'index' ? '' : name;
      const destination = path.join(
        '/',
        path.relative(staticPageDirectory, dir),
        fileName,
      );

      methods.forEach(method => {
        const source = path.join(
          '/',
          path.relative(staticPageDirectory, dir),
          fileName,
          method.path,
        );

        rewrites.push({ source, destination });
      });
    }

    log('Rewrites generated successfully');

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
  } finally {
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
    }
  }
}
