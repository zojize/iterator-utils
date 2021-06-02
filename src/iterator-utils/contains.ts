import { any } from './any';
import { sameValueZero } from '../internal/utils';

export function contains<T>(it: Iterable<T>, item: T): boolean {
    return any(it, (x) => sameValueZero(x, item));
}
