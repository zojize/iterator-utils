import { ifilter } from './ifilter';
import type { TypeGuard, PredicateFunction } from '../internal/types';
import { not, identityTypeGuard } from '../internal/utils';

export function filterFalse<T, S extends T>(
    pred: TypeGuard<T, S>,
    it: Iterable<T>,
): Generator<Exclude<T, T & S>>;
export function filterFalse<T>(pred: PredicateFunction<T>, it: Iterable<T>): Generator<T>;
export function filterFalse<T, S extends T>(
    pred: TypeGuard<T, S> | PredicateFunction<T>,
    it: Iterable<T>,
): Generator<Exclude<T, T & S> | T> {
    pred ??= identityTypeGuard;
    return ifilter(not(pred), it);
}

export const filter_false = filterFalse;
