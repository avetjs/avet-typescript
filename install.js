const fs = require('fs');
const path = require('path');

const pathSeparatorRe = /[\/\\]/g;

let root = path.join(__dirname, '..', '..');

if (process.env.TS_ROOT_FOR_TEST) {
  root = process.env.TS_ROOT_FOR_TEST;
}

const pkgFileName = path.join(root, 'package.json');
const vscFileName = path.join(root, '.vscode', 'settings.json');
const tscServerFileName = path.join(root, 'tsconfig.json');
const tscClientFileName = path.join(root, 'web', 'tsconfig.json');
const tslFileName = path.join(root, 'tslint.json');

if (!exists(vscFileName)) {
  mkdir(path.join(root, '.vscode'));
  fs.writeFileSync(vscFileName, JSON.stringify({}, null, 2));
}

if (!exists(tscClientFileName)) {
  mkdir(path.join(root, 'web'));
  fs.writeFileSync(tscClientFileName, JSON.stringify({}, null, 2));
}

let pkg;
try {
  pkg = require(pkgFileName);
} catch (err) {
  console.error('read package.json error: %s', err.message);
  process.exit(0);
}
if (!pkg.ts) {
  pkg.ts = {};
}

if (!pkg.scripts) {
  pkg.scripts = {};
}

if (!pkg.devDependencies) {
  pkg.devDependencies = {};
}

const existVscode = require(vscFileName) || {};
const vscode = Object.assign(
  {},
  existVscode,
  {
    'files.exclude': {
      USE_GITIGNORE: true,
      '**/*.js': {
        when: '$(basename).ts',
      },
      '**/**.js': {
        when: '$(basename).tsx',
      },
      '**/*.map': true,
      run: true,
      logs: true,
      out: true,
    },
  },
  pkg.ts.vscode || {}
);

const tsconfigServer = Object.assign(
  {
    compileOnSave: true,
    compilerOptions: {
      target: 'es2017',
      module: 'commonjs',
      noImplicitAny: false,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      allowSyntheticDefaultImports: true,
      charset: 'utf8',
      allowJs: false,
      pretty: true,
      noEmitOnError: false,
      noUnusedLocals: false,
      noUnusedParameters: true,
      allowUnreachableCode: false,
      allowUnusedLabels: false,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      inlineSourceMap: true,
      importHelpers: true,
      jsx: 'react-native',
    },
    include: [
      'node_modules/@types',
      'typings',
      'index.d.ts',
      'app.ts',
      'agent.ts',
      'app/**/*',
      'config/**/*',
    ],
    exclude: [ 'app/public', 'app/views' ],
  },
  pkg.ts.tsconfigServer || {}
);

const tsconfigClient = Object.assign(
  {
    compileOnSave: true,
    compilerOptions: {
      target: 'esnext',
      module: 'esnext',
      jsx: 'react-native',
      allowJs: true,
      moduleResolution: 'node',
      allowSyntheticDefaultImports: true,
      noUnusedLocals: false,
      noUnusedParameters: true,
      removeComments: false,
      preserveConstEnums: true,
      inlineSourceMap: true,
      skipLibCheck: true,
      typeRoots: [ '../node_modules/@types' ],
      lib: [ 'dom', 'es2015', 'es2016' ],
    },
    include: [ '../typings', '../index.d.ts', '.' ],
    exclude: [
      '.avet',
      'asset-prod',
      'static',
      'page/__test__',
      'component/__test__',
    ],
  },
  pkg.ts.tsconfigClient || {}
);

const tslint = Object.assign(
  {
    extends: 'tslint:latest',
    rules: {
      quotemark: [ true, 'single', 'jsx-double' ],
      'no-console': [ true, 'dir', 'log', 'error', 'warn' ],
      'space-before-function-paren': false,
      'interface-name': [ true, 'no-prefix' ],
      'adjacent-overload-signatures': true,
      'member-access': [ false ],
      'member-ordering': [
        true,
        {
          order: 'fields-first',
        },
      ],
      'object-literal-sort-keys': false,
      'max-classes-per-file': [ true, 10 ],
      'variable-name': [ true, 'allow-leading-underscore' ],
      align: [ true, 'statements' ],
    },
  },
  pkg.ts.tslint || {}
);

pkg.scripts['tsc:server'] = pkg.scripts['tsc:server'] || 'tsc';
pkg.scripts['tsc:client'] = pkg.scripts['tsc:client'] || 'tsc -p web/tsconfig.json';
pkg.scripts['tsc:server:watch'] = pkg.scripts['tsc:server:watch'] || 'tsc -w';
pkg.scripts['tsc:client:watch'] = pkg.scripts['tsc:client:watch'] || 'tsc -p web/tsconfig.json -w';
pkg.scripts['tsc:clean'] = pkg.scripts['tsc:clean'] ||
  'rimraf app/**/*.{js,map} test/**/*.{js,map} config/**/*.{js,map} web/**/*.{js,map}';
pkg.devDependencies['@types/react'] = pkg.devDependencies['@types/react'] || '^16.0.25';
pkg.devDependencies['@types/react-dom'] = pkg.devDependencies['@types/react-dom'] || '^16.0.3';
pkg.devDependencies['@types/node'] = pkg.devDependencies['@types/node'] || '^8.5.7';

if (pkg.scripts.dev && !pkg.scripts.dev.includes('tsc')) {
  pkg.scripts.dev = `npm run tsc:server:watch & npm run tsc:client:watch & ${
    pkg.scripts.dev
  }`;
}

fs.writeFileSync(pkgFileName, JSON.stringify(pkg, null, 2));
fs.writeFileSync(vscFileName, JSON.stringify(vscode, null, 2));
fs.writeFileSync(tscServerFileName, JSON.stringify(tsconfigServer, null, 2));
fs.writeFileSync(tscClientFileName, JSON.stringify(tsconfigClient, null, 2));
fs.writeFileSync(tslFileName, JSON.stringify(tslint, null, 2));

console.log('🎉 Typescript postinstall script complete.');

function exists(...args) {
  const filepath = path.join(...args);
  return fs.existsSync(filepath);
}
function mkdir(dirpath, mode) {
  if (mode == null) {
    mode = 0o0777 & ~process.umask();
  }
  dirpath.split(pathSeparatorRe).reduce((parts, part) => {
    parts += `${part}/`;
    const subpath = path.resolve(parts);
    if (!exists(subpath)) {
      try {
        fs.mkdirSync(subpath, mode);
      } catch (e) {
        throw new Error(
          `Unable to create directory "${subpath}" (Error code: ${e.code}).`,
          e
        );
      }
    }
    return parts;
  }, '');
}
