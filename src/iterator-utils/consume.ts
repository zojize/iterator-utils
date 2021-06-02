import { iter } from './iter';

export function consume<T, TReturn>(
    it: Iterable<T> | Generator<T, TReturn>,
    n = Number.POSITIVE_INFINITY,
): TReturn | undefined {
    const _it = iter(it);
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return next.value;
    }
}
