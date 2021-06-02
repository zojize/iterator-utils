import { iter } from './iter';

export function* enumerate<T>(it: Iterable<T>, start = 0): Generator<[index: number, item: T]> {
    for (const v of iter(it)) yield [start++, v];
}
