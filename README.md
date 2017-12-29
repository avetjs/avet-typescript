# avet-typescript

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/avet-typescript.svg?style=flat-square
[npm-url]: https://npmjs.org/package/avet-typescript
[travis-image]: https://img.shields.io/travis/avetjs/avet-typescript.svg?style=flat-square
[travis-url]: https://travis-ci.org/avetjs/avet-typescript
[codecov-image]: https://codecov.io/github/avetjs/avet-typescript/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/avetjs/avet-typescript?branch=master
[david-image]: https://img.shields.io/david/avetjs/avet-typescript.svg?style=flat-square
[david-url]: https://david-dm.org/avetjs/avet-typescript
[snyk-image]: https://snyk.io/test/npm/avet-typescript/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/avet-typescript
[download-image]: https://img.shields.io/npm/dm/avet-typescript.svg?style=flat-square
[download-url]: https://npmjs.org/package/avet-typescript

typescript plugin for avet, make TypeScript can be easily integrated into the project.

---

## Install

```bash
$npm i avet-typescript
```

## Uasge

because this project will be run in postinstall, and auto generator typescript about files. more info you can read `install.js`.

it is also support custom settings

```js
{
  ts: {
    vscode: {
      // your vscode settings
    },
    tsconfig: {
      // your tsconfig settings
    },
    tslint: {
      // your tslint settings
    }
  }
}
```
