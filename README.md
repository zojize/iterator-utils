# it-utils

## Installation

using pnpm

`pnpm i it-utils`

using npm

`npm i it-utils`

using yarn

`yarn add it-utils`

## Description

A direct port of the well-known python builtin library `itertools` and some extra iterator utility functions I find useful. Parts inspired by [itertools.js](https://github.com/nvie/itertools.js).

Some functions are still untested, use with caution.

## Examples

```ts
declare const numberArr: number[];
declare const stringArr: string[];

// zip
for(const [n, str] of zip(numberArr)) {  }

// RSIterator zip
const zipped = numberArr.iter().zip(stringArr).collect();
```

## TODO

- [ ] finish this README
- [x] rename/republish this repo
- [ ] more tests
- [x] port all functions from `itertools`
- [ ] as well as `more-itertools` (90%)
- [ ] JSDocs
- [ ] more iterator utilities I find useful
- [ ] implement Rust `std::iter::Iterator` somehow (90%, need tests)
- [ ] split into submodules (iterator-utils, reversible, rs-iterator)
- [ ] better rollup settup?
- [ ] code comments
- [ ] automated workflow with CI/CD (CircleCI or Travis CI?)
- [ ] rename files to fit new package name
- [ ] rename this repo as well
- [ ] more examples
