import type { NumberPredicateFunction } from '../internal/types';
import { numberIdentity } from '../internal/utils';
import { ireduce } from './ireduce';

export function min<T>(it: Iterable<T>, key: NumberPredicateFunction<T> = numberIdentity): T {
    return ireduce(it, (a, b) => (key(a) < key(b) ? a : b));
}
