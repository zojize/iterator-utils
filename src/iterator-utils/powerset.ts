import { chain } from './chain';
import { map } from './map';
import { range } from './range';
import { iter } from './iter';
import { combinations } from './combinations';
import { list } from '../internal/utils';

export function powerset<T>(it: Iterable<T>): Generator<T[]> {
    const s = list(iter(it));
    return chain.fromIterable(map((r) => combinations(s, r), range(s.length + 1)));
}
