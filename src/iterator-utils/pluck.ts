import { imap } from './imap';

export function pluck<T, K extends keyof T>(it: Iterable<T>, key: K): IterableIterator<T[K]> {
    return imap((v) => v[key], it);
}
