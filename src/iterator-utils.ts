/**
 * Many of the functions below is a director port of
 * https://docs.python.org/3/library/itertools.html
 */
import { enumerate, ifilter, imap, iter, map, range, zip } from './builtins';
import {
    AnyFunc,
    CanIter,
    OptionalTuple,
    PredicateFunction,
    Slice,
    Tuple,
    UnpackIterable,
    VoidOr,
} from './types';
import { add, extractArgs, identityPredicate, interpretSlice, not, Kwargs } from './utils';

export function* count(start = 0, step = 1): Generator<number> {
    for (;;) yield (start += step);
}

export function* cycle<T>(it: CanIter<T>): Generator<T, void, undefined> {
    const saved: T[] = [];
    for (const item of iter(it)) {
        yield item;
        saved.push(item);
    }
    for (;;) yield* saved;
}

export function* accumulate<T, R>(
    it: CanIter<T>,
    func: (a: R, b: T) => R = add as AnyFunc,
    initial?: R,
): Generator<R, R> {
    const _it = typeof initial === 'undefined' ? iter(it) : chain<T | R>([initial], iter(it));
    let result: R | undefined;
    for (const item of _it) {
        if (!result) {
            result = item as R;
            continue;
        }
        yield result;
        result = func(result, item as T);
    }
    return result!;
}

export function* chain<T>(...its: CanIter<T>[]): Generator<T> {
    for (const it of its) yield* iter(it);
}

chain.fromIterable = function* chain__fromIterable<T>(its: CanIter<T>[]): Generator<T> {
    for (const it of its) yield* iter(it);
};

chain.from_iterable = chain.fromIterable;

export function* compress<T>(it: CanIter<T>, selectors: CanIter<number | boolean>): Generator<T> {
    for (const [item, s] of zip(it, selectors)) if (s) yield item as T;
}

export function* dropwhile<T>(it: CanIter<T>, pred: PredicateFunction<T>): Generator<T> {
    const _it = iter(it);
    for (const item of _it) {
        if (!pred(item)) {
            yield item;
            break;
        }
    }
    for (const item of _it) yield item;
}

export function filterfalse<T>(
    it: CanIter<T>,
    pred: PredicateFunction<T> = identityPredicate,
): Generator<T> {
    return ifilter(it, not(pred));
}

export function groupby<T>(it: CanIter<T>, key): never {
    throw Error('not implemented!');
}

export function* islice<T>(it: CanIter<T>, ...slice: Slice): Generator<T> {
    const [start, end, step] = interpretSlice(slice);
    const _it = iter(it);
    let i = 0;
    for (;;) {
        const next = _it.next();
        if (next.done) return;
        if (i >= start && i < end) yield next.value;
        i += step;
    }
}

export function spreadimap<T, A extends ReadonlyArray<T>, R>(
    it: CanIter<A>,
    func: (...args: A) => R,
): Generator<R> {
    return imap(it, (args) => func(...args));
}

export function* repeat<O>(object: O, times = Number.POSITIVE_INFINITY): Generator<O> {
    for (let i = 0; i < times; i++) yield object;
}

export function spreadmap<T, A extends ReadonlyArray<T>, R>(
    it: CanIter<A>,
    func: (...args: A) => R,
): R[] {
    return Array.from(spreadimap(it, func));
}

export function* takewhile<T>(it: CanIter<T>, pred: PredicateFunction<T>): Generator<T> {
    for (const item of iter(it))
        if (pred(item)) yield item;
        else break;
}

/**
 * https://docs.python.org/3/library/itertools.html#itertools.tee
 */
export function tee<T, N extends number>(it: CanIter<T>, n: N = 2 as N): Tuple<Generator<T>, N> {
    const _it = iter(it);
    const deques = map(range(n), () => [] as T[]);
    function* gen(mydeque: T[]): Generator<T> {
        for (;;) {
            if (!mydeque.length) {
                const next = _it.next();
                if (next.done) return;
                else for (const d of deques) d.push(next.value);
            }
            yield mydeque.shift()!;
        }
    }
    return map(deques, (d) => gen(d)) as Tuple<Generator<T>, N>;
}

export function zipLongest<
    Args extends ReadonlyArray<unknown>,
    Kwargs_ extends Kwargs<{ fillvalue?: any }>
>(
    ...args: [...Args, Kwargs_?]
): Generator<OptionalTuple<UnpackIterable<Args>, Kwargs_['kwargs']['fillvalue']>>;
export function zipLongest<Args extends ReadonlyArray<unknown>>(
    ...args: [...Args]
): Generator<OptionalTuple<UnpackIterable<Args>, null>>;
export function* zipLongest<
    Args extends ReadonlyArray<unknown>,
    Kwargs_ extends Kwargs<{ fillvalue?: any }>
>(
    ...args: [...Args, Kwargs_?]
): Generator<OptionalTuple<UnpackIterable<Args>, Kwargs_['kwargs']['fillvalue']>> {
    const [its, { fillvalue = null }] = extractArgs(args as [...Args, Kwargs_]);
    const iterators = its.map((it) => iter(it as CanIter<Args>));
    let activeIts = iterators.length;

    if (iterators.length) {
        for (;;) {
            const result: Args[] = [];
            for (const [i, it] of enumerate(iterators)) {
                const next = it.next();
                if (next.done) {
                    activeIts--;
                    if (!activeIts) return;
                    // TODO: remove the any here, im brain dead
                    iterators[i] = repeat(fillvalue as any);
                }
                result.push(next.value);
            }
            yield result as OptionalTuple<UnpackIterable<Args>, Kwargs_['kwargs']['fillvalue']>;
        }
    }
}

export const zip_longest = zipLongest();

export function consume<T, TReturn>(
    it: CanIter<T, TReturn>,
    n = Number.POSITIVE_INFINITY,
): TReturn | void {
    const _it = iter(it);
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return next.value;
    }
}

export function ireduce<T, R>(
    it: CanIter<T>,
    func: (a: R, b: T) => R = add as AnyFunc,
    initial?: R,
): R {
    const _it = typeof initial === 'undefined' ? iter(it) : chain<T | R>([initial], iter(it));
    let result: R | undefined;
    for (const item of _it) {
        if (!result) {
            result = item as R;
            continue;
        }
        result = func(result, item as T);
    }
    return result!;
}

export function* product<T, Kwargs_ extends Kwargs<{ repeat?: 1 }>>(
    ...args: [...CanIter<T>[], Kwargs_]
): Generator<Tuple<T, VoidOr<Kwargs_['kwargs']['repeat'], 1>>> {
    const [its, { repeat: _repeat = 1 }] = extractArgs(args);
    const pools = Array.from(
        repeat(
            map(its, (it) => Array.from(iter(it))),
            _repeat,
        ),
    );
    let result = [[]] as Tuple<T, VoidOr<Kwargs_['kwargs']['repeat'], 1>>[];
    for (const pool of pools) {
        result = map(pool, (y) => map(result, (x) => (x as T[]).concat(y))) as Tuple<
            T,
            VoidOr<Kwargs_['kwargs']['repeat'], 1>
        >[];
    }
    for (const prod of result) {
        yield prod;
    }
}
