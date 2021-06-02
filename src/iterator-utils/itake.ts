import { iter } from './iter';

export function* itake<T>(n: number, it: Iterable<T>): Generator<T> {
    const _it = iter(it);
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return;
        yield next.value;
    }
}
