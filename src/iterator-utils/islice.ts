import { iter } from './iter';
import type { Slice } from '../internal/types';
import { interpretSlice } from '../internal/utils';

export function* islice<T>(it: Iterable<T>, ...slice: Slice): Generator<T> {
    const [start, stop, step] = interpretSlice(slice);
    const _it = iter(it);
    let i = 0;
    for (;;) {
        const next = _it.next();
        if (next.done) return;
        if (i >= start && i < stop) yield next.value;
        i += step;
    }
}
