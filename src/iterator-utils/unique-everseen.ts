import { iter } from './iter';
import { primitiveIdentity } from '../internal/utils';

export function* uniqueEverseen<T>(
    it: Iterable<T>,
    key: (x: T) => any = primitiveIdentity,
): Generator<T> {
    let seen = new Set();
    for (let item of iter(it)) {
        let k = key(item);
        if (!seen.has(k)) {
            seen.add(k);
            yield item;
        }
    }
}

export const unique_everseen = uniqueEverseen;
