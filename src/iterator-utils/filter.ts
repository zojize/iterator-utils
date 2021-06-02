import { ifilter } from './ifilter';
import type { TypeGuard, PredicateFunction } from '../internal/types';
import { list, identityTypeGuard, createTypeGuard } from '../internal/utils';

export function filter<T, S extends T>(pred: TypeGuard<T, S>, it: Iterable<T>): S[];
export function filter<T>(pred: PredicateFunction<T>, it: Iterable<T>): T[];
export function filter<T, S extends T>(
    pred: TypeGuard<T, S> | PredicateFunction<T>,
    it: Iterable<T>,
): (T | S)[] {
    pred ??= createTypeGuard<T, S>(identityTypeGuard);
    return list(ifilter(pred, it));
}
