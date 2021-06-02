import { chain } from './chain';

export function prepend<T>(item: T, it: Iterable<T>): Generator<T>;
export function prepend<T, V>(item: V, it: Iterable<T>): Generator<T | V>;
export function prepend<T>(item: T, it: Iterable<T>): Generator<T> {
    return chain([item], it);
}
