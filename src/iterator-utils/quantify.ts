import { iter } from './iter';
import type { PredicateFunction } from '../internal/types';
import { identityPredicate } from '../internal/utils';

export function quantify<T>(
    it: Iterable<T>,
    pred: PredicateFunction<T> = identityPredicate,
): number {
    let result = 0;
    for (const item of iter(it)) result += +pred(item);
    return result;
}
