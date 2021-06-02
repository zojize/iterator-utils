import { iter } from './iter';

export function* cycle<T>(it: Iterable<T>): Generator<T> {
    const saved: T[] = [];
    for (const item of iter(it)) {
        yield item;
        saved.push(item);
    }
    // TODO
    // @ts-expect-error: fix typing here
    for (;;) yield* saved;
}
