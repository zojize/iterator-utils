import { iter } from './iter';
import type { PredicateFunction } from '../internal/types';

export function* takeWhile<T>(it: Iterable<T>, pred: PredicateFunction<T>): Generator<T> {
    for (const item of iter(it))
        if (pred(item)) yield item;
        else break;
}

export const takewhile = takeWhile;
export const take_while = takeWhile;
