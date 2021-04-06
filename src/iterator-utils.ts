/**
 * Many of the functions below is a director port of
 * https://docs.python.org/3/library/itertools.html
 * Some inspired by https://github.com/nvie/itertools.js
 */

import {
    AnyFunc,
    CanIter,
    NumberPredicateFunction,
    OptionalTuple,
    PredicateFunction,
    Reversible,
    Slice,
    Tuple,
    UnpackIterable,
    VoidOr,
} from './types';
import {
    Kwargs,
    add,
    extractArgs,
    identity,
    identityPredicate,
    interpretSlice,
    keyToCmp,
    list,
    not,
    objectOrFunction,
    tuple,
} from './utils';
import { CURR_KEY, CURR_VAL, GROUPER, ID, IT, KEY_FUNC, REVERSED, TGT_KEY } from './symbols';
import { any, enumerate, ifilter, imap, iter, map, range, zip } from './builitins';

export function contains<T>(it: CanIter<T>, value: T): boolean {
    return any(it, (x) => x === value);
}

export function sorted<T>(it: CanIter<T>, key: NumberPredicateFunction<T>, reverse = false): T[] {
    return reverse
        ? list(iter(it)).sort(keyToCmp(key)).reverse()
        : list(iter(it)).sort(keyToCmp(key));
}

export function* count(start = 0, step = 1): Generator<number> {
    for (;;) yield (start += step) - 1;
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
        if (typeof result === 'undefined') {
            result = item as R;
            yield result;
            continue;
        }
        result = func(result, item as T);
        yield result;
    }
    return result!;
}

export function* chain<T>(...its: CanIter<T>[]): Generator<T> {
    for (const it of its) for (const item of iter(it)) yield item;
}

chain.fromIterable = function* chain__fromIterable<T>(its: CanIter<CanIter<T>>): Generator<T> {
    for (const it of iter(its)) for (const item of iter(it)) yield item;
};

chain.from_iterable = chain.fromIterable;

export function* compress<T>(it: CanIter<T>, selectors: CanIter<number | boolean>): Generator<T> {
    for (const [item, s] of zip(it, selectors)) if (s) yield item as T;
}

export function* dropwhile<T>(pred: PredicateFunction<T>, it: CanIter<T>): Generator<T> {
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
    pred: PredicateFunction<T> = identityPredicate,
    it: CanIter<T>,
): Generator<T> {
    return ifilter(not(pred), it);
}

class GroupBy<T, R = T> {
    public [KEY_FUNC]: (x: T) => R;
    public [IT]: IterableIterator<T>;
    public [TGT_KEY]: T | R;
    public [CURR_KEY]: T | R;
    public [CURR_VAL]: T;
    public [ID]: symbol;

    constructor(it: CanIter<T>, key: (x: T) => R = identity as (x: T) => R) {
        this[IT] = iter(it);
        this[KEY_FUNC] = key;
        this[TGT_KEY] = this[CURR_KEY] = this[CURR_VAL] = {} as any;
    }

    public [Symbol.iterator]() {
        return this;
    }

    public next(): IteratorResult<[T | R, Generator<T | R>]> {
        this[ID] = Symbol();
        while (this[CURR_KEY] === this[TGT_KEY]) {
            const next = this[IT].next();
            if (next.done) return { value: undefined, done: true };
            this[CURR_VAL] = next.value;
            this[CURR_KEY] = this[KEY_FUNC](this[CURR_VAL]);
        }
        this[TGT_KEY] = this[CURR_KEY];
        return {
            value: [this[CURR_KEY], this[GROUPER](this[TGT_KEY], this[ID])],
        };
    }

    public return(): IteratorResult<[T | R, Generator<T | R>]> {
        return {
            value: undefined,
            done: true,
        };
    }

    public throw(): IteratorResult<[T | R, Generator<T | R>]> {
        throw undefined;
    }

    public *[GROUPER](tgtkey: this[typeof TGT_KEY], id: this[typeof ID]): Generator<T | R> {
        while (this[ID] === id && this[CURR_KEY] === tgtkey) {
            yield this[CURR_VAL];
            const next = this[IT].next();
            if (next.done) return;
            this[CURR_VAL] = next.value;
            this[CURR_KEY] = this[KEY_FUNC](this[CURR_VAL]);
        }
    }
}

export function groupby<T, R = T>(
    it: CanIter<T>,
    key: (x: T) => R = identity as (x: T) => R,
): Generator<[T | R, Generator<T | R>]> {
    return new GroupBy(it, key);
}

export function* islice<T>(it: CanIter<T>, ...slice: Slice): Generator<T> {
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

export function spreadimap<T, A extends ReadonlyArray<T>, R>(
    func: (...args: A) => R,
    it: CanIter<A>,
): Generator<R> {
    return imap((args) => func(...args), it);
}

export function spreadmap<T, A extends ReadonlyArray<T>, R>(
    func: (...args: A) => R,
    it: CanIter<A>,
): R[] {
    return list(spreadimap(func, it));
}

export function* repeat<O>(object: O, times = Number.POSITIVE_INFINITY): Generator<O> {
    for (let i = 0; i < times; i++) yield object;
}

export function* takewhile<T>(it: CanIter<T>, pred: PredicateFunction<T>): Generator<T> {
    for (const item of iter(it))
        if (pred(item)) yield item;
        else break;
}

/**
 * https://docs.python.org/3/library/itertools.html#itertools.tee
 * TODO: can be optimized with a single FIFO deque?
 */
export function tee<T, N extends number = 2>(
    it: CanIter<T>,
    n: N = 2 as N,
): Tuple<Generator<T>, N> {
    const _it = iter(it);
    const deques = map(() => [] as T[], range(n));
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
    return map((d) => gen(d), deques) as Tuple<Generator<T>, N>;
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
                let next = it.next();
                if (next.done) {
                    activeIts--;
                    if (!activeIts) return;
                    // TODO: remove the any here, im brain dead
                    iterators[i] = repeat(fillvalue as any);
                    next = { value: fillvalue };
                }
                result.push(next.value);
            }
            yield result as OptionalTuple<UnpackIterable<Args>, Kwargs_['kwargs']['fillvalue']>;
        }
    }
}

export const zip_longest = zipLongest;

export function* product<T, Kwargs_ extends Kwargs<{ repeat?: 1 }>>(
    ...args: [...CanIter<T>[], Kwargs_]
): Generator<Tuple<T, VoidOr<Kwargs_['kwargs']['repeat'], 1>>> {
    const [its, { repeat: _repeat = 1 }] = extractArgs(args);
    const pools = list(
        repeat(
            map((it) => list(iter(it)), its),
            _repeat,
        ),
    );
    let result = [[]] as Tuple<T, VoidOr<Kwargs_['kwargs']['repeat'], 1>>[];
    for (const pool of pools) {
        result = map((y) => map((x) => (x as T[]).concat(y), result), pool) as Tuple<
            T,
            VoidOr<Kwargs_['kwargs']['repeat'], 1>
        >[];
    }
    for (const prod of result) {
        yield prod;
    }
}

export function reversed<T>(it: CanIter<T> | Reversible<T>): Generator<T> {
    // ! come on typescript
    if (it && objectOrFunction.has(typeof it as any) && REVERSED in (it as Reversible<T>)) {
        return (it as Reversible<T>)[REVERSED]();
    }
    return (function* reversed(): Generator<T> {
        const saved = list(iter(it as CanIter<T>));
        for (let i = saved.length - 1; i > 0; i--) yield saved[i];
    })();
}

export function* permutations<T, R extends number>(it: CanIter<T>, r?: R): Generator<Tuple<T, R>> {
    const pool = tuple(iter(it));
    const n = pool.length;
    r ??= n as R;
    if (r > n) return;
    let indices = list(range(n));
    const cycles = list(range(n, n - r, -1));
    const getPool = (i: number) => pool[i];
    yield map(getPool, indices.slice(0, r)) as Tuple<T, R>;
    const reversedRangeR = reversed(range(r));
    while (n) {
        let cleanExit = true;
        for (const i of reversedRangeR) {
            cycles[i] -= 1;
            if (cycles[i] === 0) {
                indices = indices
                    .slice(0, i)
                    .concat(indices.slice(i + 1))
                    .concat(indices.slice(i, i + 1));
                cycles[i] = n - i;
            } else {
                const j = indices.length - cycles[i];
                [indices[i], indices[j]] = [indices[j], indices[i]];
                yield map(getPool, indices.slice(0, r)) as Tuple<T, R>;
                cleanExit = false;
                break;
            }
        }
        if (cleanExit) return;
    }
}

export function* combinations<T, R extends number>(it: CanIter<T>, r: R): Generator<Tuple<T, R>> {
    const pool = tuple(iter(it));
    const n = pool.length;
    if (r > n) return;
    const indices = list(range(r));
    const getPool = (i: number) => pool[i];
    yield map(getPool, indices) as Tuple<T, R>;
    const reversedRangeR = reversed(range(r));
    for (;;) {
        let cleanExit = true;
        let k!: number;
        for (const i of reversedRangeR) {
            k = i;
            if (indices[i] !== i + n - r) {
                cleanExit = false;
                break;
            }
        }
        if (cleanExit) return;
        indices[k]++;
        for (const j of range(k! + 1, r)) indices[j] = indices[j - 1] + 1;
        yield map(getPool, indices) as Tuple<T, R>;
    }
}
export function* combinationsWithReplacement<T, R extends number>(
    it: CanIter<T>,
    r: R,
): Generator<Tuple<T, R>> {
    const pool = tuple(iter(it));
    const n = pool.length;
    if (!n && r) return;
    let indices = list(repeat(0, r));
    const getPool = (i: number) => pool[i];
    yield map(getPool, indices) as Tuple<T, R>;
    const reversedRangeR = reversed(range(r));
    for (;;) {
        let cleanExit = true;
        let k!: number;
        for (const i of reversedRangeR) {
            k = i;
            if (indices[i] !== n - 1) {
                cleanExit = false;
                break;
            }
        }
        if (cleanExit) return;
        indices = indices.slice(0, k).concat(list(repeat(indices[k] + 1, r - k)));
        yield map(getPool, indices) as Tuple<T, R>;
    }
}

export const combinations_with_replacement = combinationsWithReplacement;
