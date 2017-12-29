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
  const file = fs.readFileSync(
    getJSON('default', '.vscode/settings.json'),
    'utf8'
  );
  t.regex(file, /USE_GITIGNORE/);
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
  t.regex(file, /editor\.tabSize/);
});
