import { take, zip } from '../src';
import { UnpackIterable, CanIter, Tuple } from '../src/types';

export const list = Array.from;
export function lzip<T extends any[]>(...args: T): UnpackIterable<T>[] {
    return list(zip(...(args as T)));
}
export function ltake<N extends number, T>(n: N, it: CanIter<T>): Tuple<T, N> {
    return list(take(n, it)) as Tuple<T, N>;
}

// export function assertEqual()