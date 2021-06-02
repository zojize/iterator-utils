import { iter } from './iter';
import type { PredicateFunction } from '../internal/types';
import { identityPredicate } from '../internal/utils';

export function any<T>(it: Iterable<T>, key: PredicateFunction<T> = identityPredicate): boolean {
    for (const condition of iter(it)) if (key(condition)) return true;
    return false;
}
