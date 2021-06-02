import { iter } from './iter';

export function* pairwise<T>(it: Iterable<T>): Generator<[T, T]> {
    let last!: T;
    for (const item of iter(it)) {
        if (typeof last === 'undefined') {
            last = item;
            continue;
        }
        yield [last, item];
    }
}
