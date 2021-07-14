# it-utils

## Installation

```bash
pnpm i it-utils    # using pnpm
yarn add it-utils  # using yarn
npm i it-utils     # using npm
```

## Description

A direct port of the well-known python builtin library `itertools` and some extra iterator utility functions I find useful. Parts inspired by [itertools.js](https://github.com/nvie/itertools.js).

Some functions are still untested, use with caution.

## Examples

```ts
// zip
expect(Array.from(zip([1, 2], 'AB'))).toEqual([
    [1, 'A'],
    [2, 'B'],
]);

// RSIterator zip
expect([1, 2].iter().zip('AB').collect()).toEqual([
    [1, 'A'],
    [2, 'B'],
]);

// Use RSIterator like you would with Rust std::iter::Iterator!
console.log(
    [1, 2, 3, 4, 5, 6, 7]
        .iter()
        .inspect((x) => console.log(`x: ${x}`))
        .filter((x) => x % 2)
        .inspect((x) => console.log(`filtered: ${x}`))
        .map((x) => x ** 2)
        .inspect((x) => console.log(`squared: ${x}`))
        .collect(),
);
// console.log:
//  x: 1
//  filtered: 1
//  squared: 1
//  x: 2
//  x: 3
//  filtered: 3
//  squared: 9
//  x: 4
//  x: 5
//  filtered: 5
//  squared: 25
//  x: 6
//  x: 7
//  filtered: 7
//  squared: 49
//  [1, 9, 25, 49]
```

## TODO

-   [ ] finish this README
-   [x] rename/republish this repo
-   [ ] more tests
-   [x] port all functions from `itertools`
-   [x] as well as `more-itertools` (90%)
-   [ ] JSDocs
-   [ ] more iterator utilities I find useful (async)
-   [ ] implement Rust `std::iter::Iterator` somehow (90%, need tests)
-   [x] code split build
-   [ ] better rollup settup?
-   [ ] code comments
-   [ ] automated workflow with CI/CD (CircleCI or Travis CI?)
-   [ ] rename this repo as well
-   [ ] more examples
