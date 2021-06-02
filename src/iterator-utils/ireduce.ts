import { iter } from './iter';

export function ireduce<T>(it: Iterable<T>, func: (a: T, b: T) => T, initial?: T): T;
export function ireduce<T, R>(it: Iterable<T>, func: (a: R, b: T) => R, initial: R): R;
export function ireduce<T, R>(
    it: Iterable<T>,
    func: (a: T | R, b: T) => R,
    initial?: T | R,
): T | R {
    let result: T | R | undefined = initial;
    for (const item of iter(it)) {
        if (typeof result === 'undefined') {
            result = item;
            continue;
        }
        result = func(result, item as T);
    }
    return result!;
}
