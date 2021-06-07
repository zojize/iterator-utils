import { iter } from './iter';

export function* chain<T>(...its: Iterable<T>[]): Generator<T> {
    for (const it of its) for (const item of iter(it)) yield item;
}

function chain__fromIterable<T>(its: Iterable<readonly T[]>): Generator<T>;
function chain__fromIterable<T>(its: Iterable<T[]>): Generator<T>;
function chain__fromIterable<T>(its: Iterable<Iterable<T>>): Generator<T>;
function* chain__fromIterable<T>(its: Iterable<Iterable<T>>): Generator<T> {
    for (const it of iter(its)) for (const item of iter(it)) yield item;
}

chain.fromIterable = chain__fromIterable;
chain.from_iterable = chain.fromIterable;
