const test = require('ava');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '../install.js');
const cmd = `node ${filepath}`;

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

function getRoot(name) {
  return path.join(__dirname, 'fixtures', name);
}

function getJSON(name, filepath) {
  return path.join(__dirname, 'fixtures', name, filepath);
}
