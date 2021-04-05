import { COMP_FUNC, DONE, LEN, N, REVERSED, SIGN } from './symbols';
import {
    AnyFunc,
    CanIter,
    NumberPredicateFunction,
    PredicateFunction,
    Slice,
    UnpackIterable,
} from './types';
import { add, identityPredicate, interpretRange, numberIdentity } from './utils';

export function iter<T>(it: CanIter<T>): Generator<T> {
    switch (typeof it) {
        case 'string':
            return it[Symbol.iterator]() as Generator<T>;
        case 'function':
        case 'object':
            if (!it) break;
            if (Symbol.iterator in it && typeof it[Symbol.iterator] === 'function') {
                if ('next' in it && typeof it.next === 'function') return it as Generator<T>;
                return it[Symbol.iterator]();
            }
            // assumes it's an Iterator if you pass in an object with
            // a next method in it.
            if ('next' in it && typeof it.next === 'function')
                return { [Symbol.iterator]: () => it as Generator<T> } as Generator<T>;
        default:
            break;
    }
    throw new TypeError(`${it} is not iterable`);
}

export function all<T>(it: CanIter<T>, key: PredicateFunction<T> = identityPredicate): boolean {
    for (const condition of iter(it)) if (!key(condition)) return false;
    return true;
}

export function any<T>(it: CanIter<T>, key: PredicateFunction<T> = identityPredicate): boolean {
    for (const condition of iter(it)) if (key(condition)) return true;
    return false;
}

const largerThanOrEqualTo = (a: number, b: number) => a >= b;
const lessThanOrEqualTo = (a: number, b: number) => a <= b;

class Range {
    private [SIGN]: number;
    private [LEN]: number;

    constructor(public start: number, public stop: number, public step: number) {
        this[N] = this.start = start;
        this[SIGN] = Math.sign(step);
        this.stop = stop;
        this.step = step;
    }

    public [Symbol.iterator](): Generator<number> {
        return new RangeIterator(this.start, this.stop, this.step);
    }

    // https://github.com/dcrosta/xrange/blob/master/xrange.py
    public [REVERSED](): Generator<number> {
        const last = this.start + (this.len - 1) * this.step;
        return new RangeIterator(last, this.start - this[SIGN], -1 * this.step);
    }

    private get len() {
        return (
            this[LEN] ??
            (this[LEN] = Math.floor(
                (this.stop - this.start) / this.step +
                    +Boolean((this.stop - this.start) % this.step),
            ))
        );
    }
}

class RangeIterator {
    private [N]: number;
    private [SIGN]: number;
    private [COMP_FUNC]: (a: number, b: number) => boolean;
    private [LEN]: number;
    private [DONE] = false;

    constructor(public start, public stop, public step) {
        this[N] = this.start = start;
        this[SIGN] = Math.sign(step);
        this[COMP_FUNC] = this[SIGN] > 0 ? largerThanOrEqualTo : lessThanOrEqualTo;
        this.stop = stop;
        this.step = step;
    }

    public next(): IteratorResult<number> {
        if (this[DONE] || this[COMP_FUNC](this[N], this.stop)) {
            this[DONE] = true;
            return {
                value: undefined,
                done: true,
            };
        }
        const n = this[N];
        return { value: ((this[N] += this.step), n) };
    }

    /**
     * this function is implemented to match typescript's
     *  definition for Generator
     */
    public return<T>(value: T): IteratorResult<T> {
        this[DONE] = true;
        return {
            value,
            done: true,
        };
    }

    /**
     * this function is implemented to match typescript's
     *  definition for Generator
     */
    public throw(exception: any): IteratorResult<number> {
        this[DONE] = true;
        throw exception;
    }

    public [Symbol.iterator](): Generator<number> {
        return this;
    }

    public [REVERSED](): Generator<number> {
        const last = this.start + (this.len - 1) * this.step;
        return new RangeIterator(last, this[N] + this.step, -1 * this.step);
    }

    private get len() {
        return (
            this[LEN] ??
            (this[LEN] = Math.floor(
                (this.stop - this.start) / this.step +
                    +Boolean((this.stop - this.start) % this.step),
            ))
        );
    }
}

export function range(stop: number): Range;
export function range(start: number, stop: number): Range;
export function range(start: number, stop: number, step: number): Range;
export function range(...args: Slice): Range {
    let [n, stop, step] = interpretRange(args);
    return new Range(n, stop, step);
}

export function* enumerate<T>(it: CanIter<T>, start = 0): Generator<[index: number, value: T]> {
    for (const v of iter(it)) yield [start++, v];
}

export function* zip<T extends ReadonlyArray<unknown>>(...its: T): Generator<UnpackIterable<T>> {
    const iterators = its.map((it) => iter(it as CanIter<T>));
    if (iterators.length) {
        for (;;) {
            const result: T[] = [];
            for (const it of iterators) {
                const next = it.next();
                if (next.done) return;
                result.push(next.value);
            }
            yield result as UnpackIterable<T>;
        }
    }
}

export function ireduce<T, R>(
    it: CanIter<T>,
    func: (a: R, b: T) => R = add as AnyFunc,
    initial?: R,
): R {
    let result: R | undefined = initial;
    for (const item of iter(it)) {
        if (typeof result === 'undefined') {
            result = (item as unknown) as R;
            continue;
        }
        result = func(result, item as T);
    }
    return result!;
}

export function sum(it: CanIter<number>): number {
    return ireduce(it, (a, b) => a + b);
}

// TODO: use a class instead of a simple generator function
export function* imap<T, R>(func: (x: T) => R, it: CanIter<T>): Generator<R> {
    for (const item of iter(it)) yield func(item);
}

export function map<T, R>(func: (x: T) => R, it: CanIter<T>): R[] {
    return [...imap(func, it)];
}

export function* ifilter<T>(pred: PredicateFunction<T>, it: CanIter<T>): Generator<T> {
    for (const item of iter(it)) if (pred(item)) yield item;
}

export function filter<T>(pred: PredicateFunction<T> = identityPredicate, it: CanIter<T>): T[] {
    return [...ifilter(pred, it)];
}

export function max<T>(it: CanIter<T>, key: NumberPredicateFunction<T> = numberIdentity): T {
    return ireduce(it, (a, b) => (key(a) > key(b) ? a : b));
}

export function min<T>(it: CanIter<T>, key: NumberPredicateFunction<T> = numberIdentity): T {
    return ireduce(it, (a, b) => (key(a) < key(b) ? a : b));
}
