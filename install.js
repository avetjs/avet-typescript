const fs = require('fs');
const path = require('path');

const pathSeparatorRe = /[\/\\]/g;

let root = path.join(__dirname, '..', '..');

if (process.env.TS_ROOT_FOR_TEST) {
  root = process.env.TS_ROOT_FOR_TEST;
}

const pkgFileName = path.join(root, 'package.json');
const vscFileName = path.join(root, '.vscode', 'settings.json');
const tscFileName = path.join(root, 'tsconfig.json');
const tslFileName = path.join(root, 'tslint.json');

if (!exists(tscFileName)) {
  mkdir(path.join(root, '.vscode'));
  fs.writeFileSync(vscFileName, JSON.stringify({}, null, 2));
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

const vscode = Object.assign(
  require(vscFileName) || {},
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

const tsconfig = Object.assign(
  {
    compileOnSave: true,
    compilerOptions: {
      target: 'es2017',
      module: 'commonjs',
      noImplicitAny: false,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      charset: 'utf8',
      allowJs: false,
      pretty: true,
      noEmitOnError: false,
      noUnusedLocals: true,
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
    include: [ 'app/**/*', 'config/**/*', 'web/**/*', 'test/**/*.ts' ],
    exclude: [ 'app/public', 'app/views', 'web/static' ],
  },
  pkg.ts.tsconfig || {}
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

pkg.scripts.tsc = 'tsc';
pkg.scripts['tsc:watch'] = 'tsc -w';
pkg.scripts['tsc:clean'] =
  'rimraf app/**/*.{js,map} test/**/*.{js,map} config/**/*.{js,map}';

if (pkg.scripts.dev && !pkg.scripts.dev.includes('tsc:watch')) {
  pkg.scripts.dev = `npm run tsc:watch && ${pkg.scripts.dev}`;
}

fs.writeFileSync(pkgFileName, JSON.stringify(pkg, null, 2));
fs.writeFileSync(vscFileName, JSON.stringify(vscode, null, 2));
fs.writeFileSync(tscFileName, JSON.stringify(tsconfig, null, 2));
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
