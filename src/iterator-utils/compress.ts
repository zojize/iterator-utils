import { zip } from './zip';

export function* compress<T>(it: Iterable<T>, selectors: Iterable<unknown>): Generator<T> {
    for (const [item, s] of zip(it, selectors)) if (s) yield item;
}
