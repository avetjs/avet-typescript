const test = require('ava');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '../install.js');
const cmd = `node ${filepath}`;

function getRoot(name) {
  return path.join(__dirname, 'fixtures', name);
}

function getJSON(name, filepath) {
  return path.join(__dirname, 'fixtures', name, filepath);
}

test('default', t => {
  const env = Object.assign({}, process.env, {
    TS_ROOT_FOR_TEST: getRoot('default'),
  });
  execSync(cmd, { env });
  const vscfile = fs.readFileSync(
    getJSON('default', '.vscode/settings.json'),
    'utf8'
  );
  const pkgfile = fs.readFileSync(getJSON('default', 'package.json'), 'utf8');
  t.regex(vscfile, /USE_GITIGNORE/);
  t.regex(pkgfile, /avet-bin test/);
});

test('scripts', t => {
  const env = Object.assign({}, process.env, {
    TS_ROOT_FOR_TEST: getRoot('exist-scripts'),
  });
  execSync(cmd, { env });
  const file = fs.readFileSync(
    getJSON('exist-scripts', 'package.json'),
    'utf8'
  );
  t.regex(file, /npm run tsc:watch && egg-bin dev/);
  t.regex(file, /"tsc": "tsc"/);
});

test('vscode', t => {
  const env = Object.assign({}, process.env, {
    TS_ROOT_FOR_TEST: getRoot('exist-vscode'),
  });
  execSync(cmd, { env });
  const file = fs.readFileSync(
    getJSON('exist-vscode', '.vscode/settings.json'),
    'utf8'
  );
  t.regex(file, /editor\.fontSize/);
});
