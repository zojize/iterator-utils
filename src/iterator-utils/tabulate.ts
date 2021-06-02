import { count } from './count';
import { imap } from './imap';

export function tabulate<T>(func: (n: number) => T, start = 0): Generator<T> {
    return imap(func, count(start));
}
