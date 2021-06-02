import { ifilter } from './ifilter';
import type { TypeGuard, PredicateFunction } from '../internal/types';

export function firstTrue<T, S extends T>(it: Iterable<T>, pred: TypeGuard<T, S>): S;
export function firstTrue<T>(it: Iterable<T>, pred: PredicateFunction<T>): T;
export function firstTrue<T, S extends T>(
    it: Iterable<T>,
    pred: TypeGuard<T, S> | PredicateFunction<T>,
): T | S {
    return ifilter(pred, it).next().value;
}

export const first_true = firstTrue;
