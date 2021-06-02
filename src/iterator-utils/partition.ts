import { ifilter } from './ifilter';
import { filterFalse } from './filter-false';
import { tee } from './tee';
import { identityTypeGuard } from '../internal/utils';
import type { TypeGuard, PredicateFunction, Falsy } from '../internal/types';

export function partition<T>(
    it: Iterable<T>,
): [Generator<Exclude<T, T & Falsy>>, Generator<T & Falsy>];
export function partition<T, S extends T>(
    it: Iterable<T>,
    pred: TypeGuard<T, S>,
): [Generator<Exclude<T, T & S>>, Generator<S>];
export function partition<T>(
    it: Iterable<T>,
    pred: PredicateFunction<T>,
): [Generator<T>, Generator<T>];
export function partition<T, S extends T>(
    it: Iterable<T>,
    pred: TypeGuard<T, S> | PredicateFunction<T> = identityTypeGuard as TypeGuard<T, S>,
): [Generator<Exclude<T, T & S>> | Generator<T>, Generator<S> | Generator<T>] {
    const [bad, good] = tee(it);
    return [filterFalse(pred, bad), ifilter(pred, good)];
}
