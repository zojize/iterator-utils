/**
 * Useful iterator functions from the Python language
 * Some inspired by https://github.com/nvie/itertools.js
 */

import { ireduce } from './iterator-utils';
import { PredicateFunction, CanIter, NumberPredicateFunction, UnpackIterable, Slice } from './types';
import { identityPredicate, interpretRange, keyToCmp, numberIdentity } from './utils';

export function iter(it: string): Generator<string>;
export function iter<T>(it: CanIter<T>): Generator<T>;
export function iter<T>(it: CanIter<T>): Generator<T> {
    switch (typeof it) {
        case 'string':
            return it[Symbol.iterator]() as Generator<T>;
        case 'function':
        case 'object':
            if (Symbol.iterator in it) return it[Symbol.iterator]();
            // assumes it's an Iterator if you pass in an object with
            // a next method in it.
            if ('next' in it)
                return { [Symbol.iterator]: () => it as Generator<T> } as Generator<T>;
        default:
            throw new Error(`'${it}' is not iterable`);
    }
}

export function all<T>(it: CanIter<T>, key: PredicateFunction<T> = identityPredicate): boolean {
    for (const condition of iter(it)) if (!key(condition)) return false;
    return true;
}

export function any<T>(it: CanIter<T>, key: PredicateFunction<T> = identityPredicate): boolean {
    for (const condition of iter(it)) if (key(condition)) return true;
    return false;
}

export function contains<T>(it: CanIter<T>, value: T): boolean {
    return any(it, (x) => x === value);
}

export function* enumerate<T>(it: CanIter<T>, start = 0): Generator<[index: number, value: T]> {
    for (const v of iter(it)) yield [start++, v];
}

const lessThanOrEqualTo = (a: number, b: number) => a <= b;
const largerThanOrEqualTo = (a: number, b: number) => a >= b;

export function range(stop: number): Generator<number>;
export function range(start: number, stop: number): Generator<number>;
export function range(start: number, stop: number, step: number): Generator<number>;
export function* range(...args: Slice): Generator<number> {
    let [n, end, step, inc] = interpretRange(args);
    const comp = inc ? lessThanOrEqualTo : largerThanOrEqualTo;
    while (true) {
        if (comp(n, end)) return;
        yield n;
        n += step;
    }
}

export function* zip<T extends ReadonlyArray<unknown>>(...its: T): Generator<UnpackIterable<T>> {
    const iterators = its.map((it) => iter(it as CanIter<T>));
    if (iterators.length) {
        for (;;) {
            const result: T[] = [];
            for (const it of iterators) {
                const next = it.next();
                if (next.done) return;
                result.push(next.value);
            }
            yield result as UnpackIterable<T>;
        }
    }
}

export function max<T>(it: CanIter<T>, key: NumberPredicateFunction<T> = numberIdentity): T {
    return ireduce(it, (a, b) => (key(a) > key(b) ? a : b));
}

export function min<T>(it: CanIter<T>, key: NumberPredicateFunction<T> = numberIdentity): T {
    return ireduce(it, (a, b) => (key(a) < key(b) ? a : b));
}

export function sorted<T>(it: CanIter<T>, key: NumberPredicateFunction<T>, reverse = false): T[] {
    return reverse
        ? Array.from(iter(it)).sort(keyToCmp(key)).reverse()
        : Array.from(iter(it)).sort(keyToCmp(key));
}

export function sum(it: CanIter<number>): number {
    return ireduce(it, (a, b) => a + b);
}

export function* imap<T, R>(it: CanIter<T>, func: (x: T) => R): Generator<R> {
    for (const item of iter(it)) yield func(item);
}

export function map<T, R>(it: CanIter<T>, func: (x: T) => R): R[] {
    return [...imap(it, func)];
}

export function* ifilter<T>(it: CanIter<T>, pred: PredicateFunction<T>): Generator<T> {
    for (const item of iter(it)) if (pred(item)) yield item;
}

export function filter<T>(it: CanIter<T>, pred: PredicateFunction<T> = identityPredicate): T[] {
    return [...ifilter(it, pred)];
}
