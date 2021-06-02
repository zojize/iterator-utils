import { iter } from './iter';


export function* imap<T, R>(func: (x: T) => R, it: Iterable<T>): Generator<R> {
    for (const item of iter(it)) yield func(item);
}
