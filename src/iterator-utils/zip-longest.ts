import { repeat } from './repeat';
import { enumerate } from './enumerate';
import { iter } from './iter';
import { map } from './map';
import { extractArgs, Kwargs } from '../internal/utils';
import type { OptionalTuple, Zipped } from '../internal/types';

// TODO: better kwargs support
export function zipLongest<
    Args extends ReadonlyArray<Iterable<any>>,
    Kwargs_ extends Kwargs<{ fillvalue?: any }>,
>(
    ...args: [...Args, Kwargs_?]
): Generator<OptionalTuple<Zipped<Args>, Kwargs_['kwargs']['fillvalue']>>;
export function zipLongest<Args extends ReadonlyArray<Iterable<any>>>(
    ...args: [...Args]
): Generator<OptionalTuple<Zipped<Args>, null>>;
export function* zipLongest<
    Args extends ReadonlyArray<Iterable<any>>,
    Kwargs_ extends Kwargs<{ fillvalue?: any }>,
>(
    ...args: [...Args, Kwargs_?]
): Generator<OptionalTuple<Zipped<Args>, Kwargs_['kwargs']['fillvalue']>> {
    const [its, { fillvalue = null } = { fillvalue: null }] = extractArgs(args);
    // better typing here?
    const iterators = map<any, any>(iter, its);
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
