import { ireduce } from './ireduce';
import type { NumberPredicateFunction } from '../internal/types';
import { numberIdentity } from '../internal/utils';

export function max<T>(it: Iterable<T>, key: NumberPredicateFunction<T> = numberIdentity): T {
    return ireduce(it, (a, b) => (key(a) > key(b) ? a : b));
}
