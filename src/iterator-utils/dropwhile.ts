import { iter } from './iter';
import type { PredicateFunction } from '../internal/types';

export function* dropwhile<T>(pred: PredicateFunction<T>, it: Iterable<T>): Generator<T> {
    const _it = iter(it);
    for (const item of _it) {
        if (!pred(item)) {
            yield item;
            break;
        }
    }
    for (const item of _it) yield item;
}
