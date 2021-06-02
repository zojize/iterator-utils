import { imap } from './imap';
import { list } from '../internal/utils';

export function map<T, R>(func: (x: T) => R, it: Iterable<T>): R[] {
    return list(imap(func, it));
}
