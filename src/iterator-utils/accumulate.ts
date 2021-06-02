import { iter } from './iter';
import { prepend } from './prepend';

export function accumulate<T>(
    it: Iterable<T>,
    func: (a: T, b: T) => T,
    initial?: T,
): Generator<T, T>;
export function accumulate<T, R>(
    it: Iterable<T>,
    func: (a: R, b: T) => R,
    initial: R,
): Generator<R, R>;
export function* accumulate<T, R>(
    it: Iterable<T>,
    func: (a: T | R, b: T) => T | R,
    initial?: T | R,
): Generator<T | R, T | R> {
    const _it = (
        typeof initial === 'undefined' ? iter(it) : prepend(initial, iter(it))
    ) as Iterable<T>;
    let result: T | R | undefined;
    for (const item of _it) {
        if (typeof result === 'undefined') {
            result = item;
            yield result;
            continue;
        }
        result = func(result, item);
        yield result;
    }
    return result!;
}
