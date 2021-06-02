import { repeat } from './repeat';
import { zip } from './zip';
import { iter } from './iter';
import { zipLongest } from './zip-longest';
import { kwargs } from '../internal/utils';
import type { Tuple, IsUnknown } from '../internal/types';

// TODO: eliminate 'as any' in this function?

export function grouper<
    T,
    N extends number,
    Kwargs_ extends {
        fillvalue?: any;
        strict?: boolean;
    } = {
        fillvalue: null;
        strict: false;
    },
>(
    it: Iterable<T>,
    n: N,
    options: Kwargs_ = {
        strict: false,
        fillvalue: null,
    } as Kwargs_,
): Generator<
    Tuple<
        Kwargs_['strict'] extends true
            ? T
            : T | (IsUnknown<Kwargs_['fillvalue']> extends true ? null : Kwargs_['fillvalue']),
        N
    >
> {
    const { fillvalue = null, strict = false } = options;
    const args = repeat(iter(it), n);
    if (strict) return zip(...args) as any;
    return zipLongest(...args, kwargs({ fillvalue })) as any;
}

export const chunked = grouper;
