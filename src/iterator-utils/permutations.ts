import { map } from './map';
import { range } from './range';
import { iter } from './iter';
import type { Tuple } from '../internal/types';
import { list, tuple } from '../internal/utils';
import { reversed } from '../reversible/reversed';

export function permutations<T>(it: Iterable<T>): Generator<T[]>;
export function permutations<T, R extends number>(it: Iterable<T>, r: R): Generator<Tuple<T, R>>;
export function* permutations<T, R extends number>(it: Iterable<T>, r?: R): Generator<Tuple<T, R>> {
    const pool = tuple(iter(it));
    const n = pool.length;
    r ??= n as R;
    if (r > n) return;
    let indices = list(range(n));
    const cycles = list(range(n, n - r, -1));
    const getPool = (i: number) => pool[i];
    yield map(getPool, indices.slice(0, r)) as Tuple<T, R>;
    const reversedRangeR = reversed(range(r));
    while (n) {
        let cleanExit = true;
        for (const i of reversedRangeR) {
            cycles[i] -= 1;
            if (cycles[i] === 0) {
                indices = indices
                    .slice(0, i)
                    .concat(indices.slice(i + 1))
                    .concat(indices.slice(i, i + 1));
                cycles[i] = n - i;
            } else {
                const j = indices.length - cycles[i];
                [indices[i], indices[j]] = [indices[j], indices[i]];
                yield map(getPool, indices.slice(0, r)) as Tuple<T, R>;
                cleanExit = false;
                break;
            }
        }
        if (cleanExit) return;
    }
}
