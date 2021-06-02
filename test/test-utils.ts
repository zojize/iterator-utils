import { range, itake, zip } from '../src';
import { UnpackIterable, CanIter, Tuple, Slice } from '../src/internal/types';

export const list = Array.from;
export function lzip<T extends any[]>(...args: T): UnpackIterable<T>[] {
    return list(zip(...(args as T)));
}
export function ltake<N extends number, T>(n: N, it: Iterable<T>): Tuple<T, N> {
    return list(itake(n, it)) as Tuple<T, N>;
}
export function lrange(...args: Slice): number[] {
    return list(range(...(args as [number])));
}
