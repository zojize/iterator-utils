import { iter } from './iter';
import type { UnpackIterable } from '../internal/types';

export function* zip<T extends readonly Iterable<any>[]>(
    ...its: T
): Generator<UnpackIterable<T>> {
    const iterators = its.map((it) => iter(it));
    if (iterators.length) {
        for (;;) {
            const result: T[] = [];
            for (const it of iterators) {
                const next = it.next();
                if (next.done) return;
                result.push(next.value);
            }
            yield result as UnpackIterable<T>;
        }
    }
}
