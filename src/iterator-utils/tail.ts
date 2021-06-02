import { iter } from './iter';
import { list } from '../internal/utils';

export function tail<T>(n: number, it: Iterable<T>): IterableIterator<T> {
    const arr = list(iter(it));
    return arr.slice(arr.length - n)[Symbol.iterator]();
}
