import { repeat } from './repeat';
import { enumerate } from './enumerate';
import { iter } from './iter';
import { extractArgs, Kwargs } from '../internal/utils';
import type { OptionalTuple, UnpackIterable } from '../internal/types';

// TODO: better kwargs support
export function zipLongest<
    Args extends ReadonlyArray<Iterable<any>>,
    Kwargs_ extends Kwargs<{ fillvalue?: any }>,
>(
    ...args: [...Args, Kwargs_?]
): Generator<OptionalTuple<UnpackIterable<Args>, Kwargs_['kwargs']['fillvalue']>>;
export function zipLongest<Args extends ReadonlyArray<Iterable<any>>>(
    ...args: [...Args]
): Generator<OptionalTuple<UnpackIterable<Args>, null>>;
export function* zipLongest<
    Args extends ReadonlyArray<Iterable<any>>,
    Kwargs_ extends Kwargs<{ fillvalue?: any }>,
>(
    ...args: [...Args, Kwargs_?]
): Generator<OptionalTuple<UnpackIterable<Args>, Kwargs_['kwargs']['fillvalue']>> {
    const [its, { fillvalue = null } = { fillvalue: null }] = extractArgs(args);
    const iterators: Generator<any>[] = its.map(iter);
    let activeIts = iterators.length;

    if (iterators.length) {
        for (;;) {
            const result: Args[] = [];
            for (const [i, it] of enumerate(iterators)) {
                let next = it.next();
                if (next.done) {
                    activeIts--;
                    if (!activeIts) return;
                    iterators[i] = repeat(fillvalue);
                    next = { value: fillvalue };
                }
                result.push(next.value);
            }
            yield result as any;
        }
    }
}

export const zip_longest = zipLongest;
