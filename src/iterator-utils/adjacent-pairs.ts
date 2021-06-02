import { adjacentNTuples } from './adjacent-n-tuples';

export function adjacentPairs<T>(it: Iterable<T>): Generator<[T, T]> {
    return adjacentNTuples(it, 2);
}

export const adjacent_pairs = adjacentPairs;
