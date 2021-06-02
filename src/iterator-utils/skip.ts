import { iter } from './iter';

export function* skip<T>(n: number, it: Iterable<T>): Generator<T> {
    const _it = iter(it);
    for (let i = 0; i < n; i++) _it.next();
    for (;;) {
        const next = _it.next();
        if (next.done) return;
        yield next.value;
    }
}
