import { CanIter, IsUnknown, Optional, PredicateFunction, Tuple } from './types';
import { iter, imap, zip, map, ifilter, range } from './builitins';
import { chain, combinations, count, filterfalse, repeat, tee, zipLongest } from './iterator-utils';
import { identityPredicate, kwargs, list, primitiveIdentity } from './utils';

export function* itake<T>(n: number, it: CanIter<T>): Generator<T> {
    const _it = iter(it);
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return;
        yield next.value;
    }
}

export function* take<T>(n: number, it: Iterator<T>): Generator<T> {
    for (let i = 0; i < n; i++) {
        const next = it.next();
        if (next.done) return;
        yield next.value;
    }
}

export function prepend<T>(value: T, it: CanIter<T>): Generator<T> {
    return chain([value], it);
}

export function tabulate<T>(func: (n: number) => T, start = 0): Generator<T> {
    return imap(func, count(start));
}

export function tail<T>(n: number, it: CanIter<T>): Generator<T> {
    const arr = list(iter(it));
    const len = arr.length;
    return arr.slice(len - n)[Symbol.iterator]() as Generator<T>;
}

export function consume<T, TReturn>(
    it: CanIter<T, TReturn>,
    n = Number.POSITIVE_INFINITY,
): Optional<TReturn> {
    const _it = iter(it);
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return next.value;
    }
}

export function nth<T, D = null>(
    it: CanIter<T>,
    n: number,
    _default: D = (null as unknown) as D,
): T | D {
    const _it = iter(it);
    let val!: T;
    for (let i = 0; i < n; i++) {
        const next = _it.next();
        if (next.done) return _default;
        val = next.value;
    }
    return val ?? _default;
}

export function allEqual(it: CanIter<unknown>): boolean {
    let last: unknown;
    for (const item of iter(it)) {
        if (typeof last === 'undefined') {
            last = item;
            continue;
        }
        if (last !== item) return false;
        last = item;
    }
    return true;
}

export const all_equal = allEqual;

export function quantify<T>(
    it: CanIter<T>,
    pred: PredicateFunction<T> = identityPredicate as PredicateFunction<T>,
): number {
    let result = 0;
    for (const item of iter(it)) result += +pred(item);
    return result;
}

export function padNull<T>(it: CanIter<T>): Generator<T | null> {
    return chain(it, repeat(null));
}

export function convolve(): never {
    // https://betterexplained.com/articles/intuitive-convolution/
    // implement this when I understand whats going on
    throw Error('not implemented');
}

export const flatten = chain.fromIterable;

export function* repeatfunc<Args extends ReadonlyArray<unknown>, Returns>(
    func: (...args: Args) => Returns,
    times: number,
    ...args: Args
): Generator<Returns> {
    times ??= Number.POSITIVE_INFINITY;
    for (let i = 0; i < times; i++) yield func(...args);
}

export function* pairwise<T>(it: CanIter<T>): Generator<[T, T]> {
    let last!: T;
    for (const item of iter(it)) {
        if (typeof last === 'undefined') {
            last = item;
            continue;
        }
        yield [last, item];
    }
}

export function grouper<
    T,
    N extends number,
    Kwargs_ extends {
        fillvalue?: any;
        strict?: boolean;
    } = {
        fillvalue: null;
        strict: false;
    }
>(
    it: CanIter<T>,
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

export function* roundrobin<T>(...its: CanIter<T>[]): Generator<T> {
    const iterators = map(iter, its);
    let activeIts = iterators.length;
    while (activeIts) {
        for (let i = 0; i < activeIts; i++) {
            const next = iterators[i].next();
            if (next.done) {
                iterators.splice(i, 1);
                activeIts--;
                i--;
                continue;
            }
            yield next.value;
        }
    }
}

export function partition<T>(
    it: CanIter<T>,
    pred: PredicateFunction<T> = identityPredicate,
): [Generator<T>, Generator<T>] {
    const [t1, t2] = tee(it);
    return [filterfalse(pred, t1), ifilter(pred, t2)];
}

export function powerset<T>(it: CanIter<T>): Generator<T[]> {
    const s = list(iter(it));
    return chain.fromIterable(map((r) => combinations(s, r), range(s.length + 1)));
}

export function* uniqueEverseen<T>(
    it: CanIter<T>,
    key: (x: T) => any = primitiveIdentity,
): Generator<T> {
    let seen = new Set();
    for (let item of iter(it)) {
        let k = key(item);
        if (!seen.has(k)) {
            seen.add(k);
            yield item;
        }
    }
}

export const unique_everseen = uniqueEverseen;

export function* uniqueJustseen<T, R>(
    it: CanIter<T>,
    key: (x: T) => R = primitiveIdentity as (x: T) => R,
): Generator<T> {
    let last!: R;
    for (const item of iter(it)) {
        const k = key(item);
        if (k !== last) {
            yield item;
            last = k;
        }
    }
}

export const unique_justseen = uniqueJustseen;

export function firstTrue<T>(it: CanIter<T>, pred: PredicateFunction<T>): T {
    return ifilter(pred, it).next().value;
}

export const first_true = firstTrue;
