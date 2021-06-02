import { map } from './map';
import { range } from './range';
import { iter } from './iter';
import type { Tuple } from '../internal/types';

/**
 * https://docs.python.org/3/library/itertools.html#itertools.tee
 * TODO: can be optimized with a single FIFO deque?
 */

export function tee<T>(
    it: Iterable<T>,
): [Generator<T>, Generator<T>] ;
export function tee<T, N extends number = 2>(
    it: Iterable<T>,
    n: N,
): Tuple<Generator<T>, N> ;
export function tee<T, N extends number = 2>(
    it: Iterable<T>,
    n?: N,
): Tuple<Generator<T>, N> | [Generator<T>, Generator<T>] {
    const _it = iter(it);
    const deques = map((): T[] => [], range(n ?? 2));
    function* gen(mydeque: T[]): Generator<T> {
        for (;;) {
            if (!mydeque.length) {
                const next = _it.next();
                if (next.done) return;
                else for (const d of deques) d.push(next.value);
            }
            yield mydeque.shift()!;
        }
    }
    return map((d) => gen(d), deques) as Tuple<Generator<T>, N>;
}
