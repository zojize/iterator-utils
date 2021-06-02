import { iter } from './iter';

export function nth<T>(it: Iterable<T>, n: number): T;
export function nth<T, D = null>(it: Iterable<T>, n: number, default_: D): T | D;
export function nth<T, D = null>(
    it: Iterable<T>,
    n: number,
    default_: D = null as unknown as D,
): T | D {
    const _it = iter(it);
    let val!: T;
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return default_;
        val = next.value;
    }
    return val ?? default_;
}
