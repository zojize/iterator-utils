import { iter } from './iter';
import type { NumberPredicateFunction } from '../internal/types';
import { list, keyToCmp } from '../internal/utils';

export function sorted<T>(it: Iterable<T>, key: NumberPredicateFunction<T>, reverse = false): T[] {
    return reverse
        ? list(iter(it)).sort(keyToCmp(key)).reverse()
        : list(iter(it)).sort(keyToCmp(key));
}
