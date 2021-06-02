import { RSIterable } from './rs-iterator';

declare global {
    interface Array<T> extends RSIterable<T> {}
    // TODO: Map, TypedArrays, And other iterable builtin objects
}

const makeRSIterable = RSIterable();

makeRSIterable(Array);

[1, 2, 3].iter().map((x) => x ** 2).groupby();

export {};
