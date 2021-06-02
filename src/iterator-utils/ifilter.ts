import { iter } from './iter';
import type { TypeGuard, PredicateFunction } from '../internal/types';

export function ifilter<T, S extends T>(pred: TypeGuard<T, S>, it: Iterable<T>): Generator<S>;
export function ifilter<T>(pred: PredicateFunction<T>, it: Iterable<T>): Generator<T>;
export function* ifilter<T, S extends T>(
    pred: TypeGuard<T, S> | PredicateFunction<T>,
    it: Iterable<T>,
): Generator<T | S> {
    for (const item of iter(it)) if (pred(item)) yield item;
}
