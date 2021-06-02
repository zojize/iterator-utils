import type { Reversible } from './reversible';
import { isReversible } from './reversible';
import { iter } from '../iterator-utils/iter';
import { list } from '../internal/utils';

export function reversed<T>(it: Iterable<T> | Reversible<T>): Generator<T> {
    if (isReversible(it)) {
        return (function* reversed() {
            yield* {
                [Symbol.iterator](): Iterator<T> {
                    return it[Symbol.reversedIterator]();
                },
            };
        })();
    }
    return (function* reversed(): Generator<T> {
        const saved = list(iter(it));
        for (let i = saved.length - 1; i > 0; i--) yield saved[i];
    })();
}
