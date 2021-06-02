import { map } from './map';
import { range } from './range';
import { iter } from './iter';
import type { Tuple } from '../internal/types';
import { list, tuple } from '../internal/utils';
import { reversed } from '../reversible/reversed';

export function* combinations<T, R extends number>(it: Iterable<T>, r: R): Generator<Tuple<T, R>> {
    const pool = tuple(iter(it));
    const n = pool.length;
    if (r > n) return;
    const indices = list(range(r));
    const getPool = (i: number) => pool[i];
    yield map(getPool, indices) as Tuple<T, R>;
    const reversedRangeR = reversed(range(r));
    for (;;) {
        let cleanExit = true;
        let k!: number;
        for (const i of reversedRangeR) {
            k = i;
            if (indices[i] !== i + n - r) {
                cleanExit = false;
                break;
            }
        }
        if (cleanExit) return;
        indices[k]++;
        for (const j of range(k! + 1, r)) indices[j] = indices[j - 1] + 1;
        yield map(getPool, indices) as Tuple<T, R>;
    }
}
