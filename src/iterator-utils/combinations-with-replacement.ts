import { repeat } from './repeat';
import { map } from './map';
import { range } from './range';
import { iter } from './iter';
import { reversed } from '../reversible/reversed';
import { list, tuple } from '../internal/utils';
import type { Tuple } from '../internal/types';

export function* combinationsWithReplacement<T, R extends number>(
    it: Iterable<T>,
    r: R,
): Generator<Tuple<T, R>> {
    const pool = tuple(iter(it));
    const n = pool.length;
    if (!n && r) return;
    let indices = list(repeat(0, r));
    const getPool = (i: number) => pool[i];
    yield map(getPool, indices) as Tuple<T, R>;
    const reversedRangeR = reversed(range(r));
    for (;;) {
        let cleanExit = true;
        let k!: number;
        for (const i of reversedRangeR) {
            k = i;
            if (indices[i] !== n - 1) {
                cleanExit = false;
                break;
            }
        }
        if (cleanExit) return;
        indices = indices.slice(0, k).concat(list(repeat(indices[k] + 1, r - k)));
        yield map(getPool, indices) as Tuple<T, R>;
    }
}

export const combinations_with_replacement = combinationsWithReplacement;
