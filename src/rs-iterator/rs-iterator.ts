import type {
    PredicateFunction,
    Tuple,
    TypeGuard,
    Slice,
    NumberPredicateFunction,
    Falsy,
    AnyFunc,
    Zipped,
} from '../internal/types';
import { GeneratorImplementation } from '../internal/generator-implementation';
import { identityTypeGuard, isIterable } from '../internal/utils';
import {
    accumulate,
    adjacentNTuples,
    adjacentPairs,
    all,
    allEqual,
    any,
    chain,
    combinations,
    combinationsWithReplacement,
    compress,
    consume,
    contains,
    cycle,
    dropwhile,
    enumerate,
    filter,
    filterFalse,
    firstTrue,
    groupby,
    iforEach,
    imap,
    inspect,
    intersperse,
    ireduce,
    islice,
    itake,
    max,
    min,
    nth,
    padNull,
    pairwise,
    partition,
    permutations,
    pluck,
    powerset,
    prepend,
    quantify,
    roundrobin,
    skip,
    spreadMap,
    tail,
    tee,
    uniqueEverseen,
    zip,
} from '../iterator-utils';

export interface RSIterable<T, TReturn = undefined, TNext = never> {
    iter(): RSIterator<T, TReturn, TNext>;
}

export class RSIterator<T, TReturn = undefined, TNext = never>
    extends GeneratorImplementation<T, TReturn, TNext>
    implements RSIterable<T, TReturn, TNext>
{
    public iterator: Iterator<T, TReturn, TNext> | Iterator<T>;

    constructor(it: Generator<T, TReturn, TNext> | Iterable<T>) {
        super();
        if (isIterable(it)) this.iterator = it[Symbol.iterator]();
        else throw TypeError(`${it} is not iterable`);
    }

    // why not? :)
    static new<T, TReturn = void, TNext = never>(
        it: Iterable<T> | Generator<T, TReturn, TNext>,
    ): RSIterator<T, TReturn, TNext> {
        return new RSIterator(it);
    }

    public iter(): this {
        return this;
    }

    public collect(): T[];
    public collect<Res>(collector: (it: this) => Res): Res;
    public collect<Res>(collector?: (it: this) => Res): T[] | Res {
        return (collector ?? Array.from)(this);
    }

    public next(): IteratorResult<T> {
        if (this.done) return { value: void 0, done: true };
        const next = this.iterator.next();
        this.done = Boolean(next.done);
        return next;
    }

    public throw(e: unknown): IteratorResult<T> {
        if ('throw' in this.iterator && typeof this.iterator.throw === 'function')
            return this.iterator.throw(e);
        throw e;
    }

    public return(value?: TReturn): IteratorResult<T, TReturn> {
        if ('return' in this.iterator && typeof this.iterator.return === 'function')
            return this.iterator.return(value);
        return { value: void 0 as unknown as TReturn, done: true };
    }

    public [Symbol.iterator](): this {
        return this;
    }

    // implementation details
    public accumulate(func: (a: T, b: T) => T, initial?: T): RSIterator<T, T>;
    public accumulate<R>(func: (a: R, b: T) => T, initial: R): RSIterator<R>;
    public accumulate<T, R>(
        func: (a: T | R, b: T) => T | R,
        initial?: T | R,
    ): RSIterator<T, T> | RSIterator<R> {
        // TODO
        // @ts-expect-error: fix typing here
        return RSIterator.new(accumulate(this, func, initial));
    }

    public adjacentNTuples<N extends number>(n: N): RSIterator<Tuple<T, N>> {
        return RSIterator.new(adjacentNTuples(this, n));
    }
    public adjacent_n_tuples<N extends number>(n: N): RSIterator<Tuple<T, N>> {
        return this.adjacentNTuples(n);
    }

    public adjacentPairs(): RSIterator<[T, T]> {
        return RSIterator.new(adjacentPairs(this));
    }
    public adjacent_pairs(): RSIterator<[T, T]> {
        return this.adjacentPairs();
    }

    public allEqual(): boolean {
        return allEqual(this);
    }
    public all_equal(): boolean {
        return this.allEqual();
    }

    public all(key?: PredicateFunction<T>): boolean {
        return all(this, key);
    }

    public any(key?: PredicateFunction<T>): boolean {
        return any(this, key);
    }

    public get chain(): {
        <U>(...its: Iterable<U>[]): RSIterator<T | U>;
        fromIterable<U>(its: Iterable<readonly U[]>): RSIterator<T | U>;
        fromIterable<U>(its: Iterable<U[]>): RSIterator<T | U>;
        fromIterable<U>(its: Iterable<Iterable<U>>): RSIterator<T | U>;
        from_iterable: RSIterator<T>['chain']['fromIterable'];
    } {
        const fromIterable = <T>(its: Iterable<Iterable<T>>): RSIterator<T> => {
            return RSIterator.new(chain.fromIterable(its));
        };
        const chain_: {
            <U>(...its: Iterable<U>[]): RSIterator<T | U>;
            fromIterable<U>(its: Iterable<readonly U[]>): RSIterator<T | U>;
            fromIterable<U>(its: Iterable<U[]>): RSIterator<T | U>;
            fromIterable<U>(its: Iterable<Iterable<U>>): RSIterator<T | U>;
            from_iterable: RSIterator<T>['chain']['fromIterable'];
        } = Object.assign(
            <U>(...its: Iterable<U>[]): RSIterator<T | U> => {
                return RSIterator.new(chain<T | U>(this, ...its));
            },
            {
                fromIterable,
                from_iterable: fromIterable,
            },
        );

        return chain_;
    }

    public combinationsWithReplacement<R extends number>(r: R): RSIterator<Tuple<T, R>> {
        return RSIterator.new(combinationsWithReplacement(this, r));
    }
    public get combinations_with_replacement(): this['combinationsWithReplacement'] {
        return this.combinationsWithReplacement;
    }

    public combinations<R extends number>(r: R): RSIterator<Tuple<T, R>> {
        return RSIterator.new(combinations(this, r));
    }

    public compress(selectors: Iterable<unknown>): RSIterator<T> {
        return RSIterator.new(compress(this, selectors));
    }

    public consume(n?: number): TReturn | undefined {
        return consume(this, n);
    }

    public contains(item?: T): boolean {
        return contains(this, item);
    }

    // TODO: implement this
    public convolve(): never {
        throw 'not implemented!';
    }

    public count(): number {
        return Array.from(this).length;
    }

    public cycle(): RSIterator<T> {
        return RSIterator.new(cycle(this));
    }

    public dropWhile(pred: PredicateFunction<T>): RSIterator<T> {
        return RSIterator.new(dropwhile(pred, this));
    }
    public drop_while(pred: PredicateFunction<T>): RSIterator<T> {
        return this.dropWhile(pred);
    }

    public enumerate(start?: number): RSIterator<[index: number, item: T]> {
        return RSIterator.new(enumerate(this, start));
    }

    public filterFalse<S extends T>(pred: TypeGuard<T, S>): RSIterator<Exclude<T, T & S>>;
    public filterFalse(pred: PredicateFunction<T>): RSIterator<T>;
    public filterFalse<S extends T>(
        pred: TypeGuard<T, S> | PredicateFunction<T>,
    ): Generator<Exclude<T, T & S> | T> {
        return RSIterator.new(filterFalse(pred, this));
    }
    public get filter_false(): this['filterFalse'] {
        return this.filterFalse;
    }

    public filter<S extends T>(pred: TypeGuard<T, S>): RSIterator<S>;
    public filter(pred: PredicateFunction<T>): RSIterator<T>;
    public filter<S extends T>(pred: TypeGuard<T, S> | PredicateFunction<T>): RSIterator<T | S> {
        return RSIterator.new(filter(pred, this));
    }

    public firstTrue<S extends T>(pred: TypeGuard<T, S>): S;
    public firstTrue(pred: PredicateFunction<T>): T {
        return firstTrue(this, pred);
    }
    public get first_true(): this['firstTrue'] {
        return this.firstTrue;
    }

    public get flatten(): this['chain']['fromIterable'] {
        return this.chain.fromIterable;
    }

    public groupby(): RSIterator<[T, Generator<T>]>;
    public groupby<R = T>(key: (x: T) => R): RSIterator<[T | R, Generator<T | R>]>;
    public groupby<R = T>(key?: (x: T) => R): RSIterator<[T | R, Generator<T | R>]> {
        return RSIterator.new(groupby(this, key));
    }

    // TODO: finish this when kwargs is ready
    // grouper
    // chuncked

    public forEach(cb: (item?: T, return_?: this['return']) => TNext): TReturn | undefined {
        return iforEach(this, cb);
    }
    public get for_each(): RSIterator<T>['forEach'] {
        // TODO
        // @ts-expect-error: fix typing here
        return this.forEach;
    }

    public inspect(func: AnyFunc): RSIterator<T> {
        return RSIterator.new(inspect(func, this));
    }

    public intersperse<Fill>(item: Fill): RSIterator<T | Fill> {
        return RSIterator.new(intersperse(item, this));
    }

    public reduce(func: (a: T, b: T) => T, initial?: T): T;
    public reduce<R>(func: (a: R, b: T) => T, initial: R): R;
    public reduce<R>(func: (a: T | R, b: T) => R, initial?: T | R): T | R {
        return ireduce(this, func, initial as T | R);
    }

    public slice(...slice: Slice): RSIterator<T> {
        return RSIterator.new(islice(this, ...slice));
    }

    public map<R>(func: (x: T) => R): RSIterator<R> {
        return RSIterator.new(imap(func, this));
    }

    public max(key?: NumberPredicateFunction<T>): T {
        return max(this, key);
    }

    public min(key?: NumberPredicateFunction<T>): T {
        return min(this, key);
    }

    public nth(n: number): T;
    public nth<D>(n: number, default_: D): T | D;
    public nth<D>(n: number, default_?: D): T | D {
        return nth(this, n, default_ as D);
    }

    public padNull(): RSIterator<T | null> {
        return RSIterator.new(padNull(this));
    }
    public get pad_null(): this['padNull'] {
        return this.padNull;
    }

    public pairwise(): RSIterator<[T, T]> {
        return RSIterator.new(pairwise(this));
    }

    public partition(): [RSIterator<Exclude<T, T & Falsy>>, RSIterator<T & Falsy>];
    public partition<S extends T>(
        pred: TypeGuard<T, S>,
    ): [RSIterator<Exclude<T, T & S>>, RSIterator<S>];
    public partition<T>(pred: PredicateFunction<T>): [RSIterator<T>, RSIterator<T>];
    public partition<T, S extends T>(
        pred: TypeGuard<T, S> | PredicateFunction<T> = identityTypeGuard as TypeGuard<T, S>,
    ): [RSIterator<Exclude<T, T & S>> | RSIterator<T>, RSIterator<S> | RSIterator<T>] {
        // TODO
        // @ts-expect-error: fix typing here
        return partition(this, pred).map(RSIterator.new as any) as any;
    }

    public permutations(): RSIterator<T[]>;
    public permutations<R extends number>(r: R): RSIterator<Tuple<T, R>>;
    public permutations<R extends number>(r?: R): RSIterator<Tuple<T, R> | T[]> {
        // TODO
        // @ts-expect-error: fix typing here
        return RSIterator.new(permutations(this, r));
    }

    public pluck<K extends keyof T>(key: K): RSIterator<T[K]> {
        return RSIterator.new(pluck(this, key));
    }

    public powerset(): RSIterator<T[]> {
        return RSIterator.new(powerset(this));
    }

    public prepend(item: T): RSIterator<T>;
    public prepend<V>(item: V): RSIterator<T | V>;
    public prepend<V>(item: T | V): RSIterator<T | V> {
        return RSIterator.new(prepend(item, this));
    }

    // TODO
    // product

    public quantify(pred: PredicateFunction<T>): number {
        return quantify(this, pred);
    }

    // TODO
    public repeat(n: number): RSIterator<T> {
        throw 'no implemented';
        // return RSIterator.new();
    }

    public roundrobin(): RSIterator<T>;
    public roundrobin(...its: Iterable<T>[]): RSIterator<T>;
    public roundrobin<U>(...its: Iterable<U>[]): RSIterator<T | U>;
    public roundrobin<U>(...its: Iterable<T | U>[]): RSIterator<T | U> {
        return RSIterator.new(roundrobin(this, ...its));
    }

    public skip(n: number): RSIterator<T> {
        return RSIterator.new(skip(n, this));
    }

    // sorted?

    public spreadMap<R>(
        this: RSIterator<T & unknown[]>,
        func: (...args: T & unknown[]) => R,
    ): RSIterator<R> {
        return RSIterator.new(spreadMap(func, this));
    }
    public get spread_map(): this['spreadMap'] {
        return this.spreadMap;
    }

    public tail(n: number): RSIterator<T> {
        return RSIterator.new(tail(n, this));
    }

    public take(n: number): RSIterator<T> {
        return RSIterator.new(itake(n, this));
    }

    public get tap(): this['inspect'] {
        return this.inspect;
    }

    public tee(): [RSIterator<T>, RSIterator<T>];
    public tee<N extends number>(n: N): Tuple<RSIterator<T>, N>;
    public tee<N extends number>(n?: N): Tuple<RSIterator<T>, N> | [RSIterator<T>, RSIterator<T>] {
        return tee(this, n as number).map(RSIterator.new) as Tuple<RSIterator<T>, N>;
    }

    public uniqueEverseen(key?: (x: T) => any): RSIterator<T> {
        return RSIterator.new(uniqueEverseen(this, key));
    }
    public get unique_everseen(): this['uniqueEverseen'] {
        return this.uniqueEverseen;
    }

    // TODO: uniqueJustseen

    // TODO: ziplongest
    public zip<Its extends readonly Iterable<any>[]>(
        ...its: Its
    ): RSIterator<Zipped<[this, ...Its]>> {
        return RSIterator.new(zip(this, ...its));
    }
}

export const RSIterable =
    <T, TReturn = undefined, TNext = never>() =>
    (base: {
        prototype: (Iterable<T> | Generator<T, TReturn, TNext>) & Record<keyof any, any>;
    }) => {
        base.prototype.iter = function iter() {
            return RSIterator.new(this);
        };
    };
