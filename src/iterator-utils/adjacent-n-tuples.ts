import { imap } from './imap';
import { range } from './range';
import { zip } from './zip';
import { iter } from './iter';
import { list } from '../internal/utils';
import type { Tuple } from '../internal/types';

// https://github.com/manim-kindergarten/manim/blob/cd19538a80b85a0f3e2469bef26137c012bb210a/manimlib/utils/iterables.py#L36

export function adjacentNTuples<T, N extends number>(
    it: Iterable<T>,
    n: N,
): Generator<Tuple<T, N>> {
    const arr = list(iter(it));
    return zip(...imap((k) => [...arr.slice(k), ...arr.slice(0, k)], range(n))) as Generator<
        Tuple<T, N>
    >;
}

export const adjacent_n_tuples = adjacentNTuples;
