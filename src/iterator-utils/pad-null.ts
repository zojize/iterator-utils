import { repeat } from './repeat';
import { chain } from './chain';

export function padNull<T>(it: Iterable<T>): Generator<T | null> {
    return chain(it, repeat(null));
}

export const pad_null = padNull;
