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
    tap,
    tee,
    uniqueEverseen,
    zip,
} from '../iterator-utils';

export interface RSIterable<T, TReturn = any, TNext = undefined> {
    iter(): RSIterator<T, TReturn, TNext>;
}

export class RSIterator<T, TReturn = any, TNext = undefined>
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
    static new<T, TReturn = any, TNext = undefined>(
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
    public combinations_with_replacement<R extends number>(r: R): RSIterator<Tuple<T, R>> {
        return RSIterator.new(combinationsWithReplacement(this, r));
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
    public filter_false<S extends T>(pred: TypeGuard<T, S>): RSIterator<Exclude<T, T & S>>;
    public filter_false(pred: PredicateFunction<T>): RSIterator<T>;
    public filter_false<S extends T>(
        pred: TypeGuard<T, S> | PredicateFunction<T>,
    ): Generator<Exclude<T, T & S> | T> {
        return RSIterator.new(filterFalse(pred, this));
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
    public first_true<S extends T>(pred: TypeGuard<T, S>): S;
    public first_true(pred: PredicateFunction<T>): T {
        return firstTrue(this, pred);
    }

    public flatten<U>(its: Iterable<Iterable<U>>): RSIterator<T | U> {
        return this.chain.fromIterable(its);
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
    public for_each(cb: (item?: T, return_?: this['return']) => TNext): TReturn | undefined {
        return iforEach(this, cb);
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
    public pad_null(): RSIterator<T | null> {
        return RSIterator.new(padNull(this));
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
    public spread_map<R>(
        this: RSIterator<T & unknown[]>,
        func: (...args: T & unknown[]) => R,
    ): RSIterator<R> {
        return RSIterator.new(spreadMap(func, this));
    }

    public tail(n: number): RSIterator<T> {
        return RSIterator.new(tail(n, this));
    }

    public take(n: number): RSIterator<T> {
        return RSIterator.new(itake(n, this));
    }

    public tap(func: AnyFunc): RSIterator<T> {
        return RSIterator.new(tap(func, this));
    }

    public tee(): [RSIterator<T>, RSIterator<T>];
    public tee<N extends number>(n: N): Tuple<RSIterator<T>, N>;
    public tee<N extends number>(n?: N): Tuple<RSIterator<T>, N> | [RSIterator<T>, RSIterator<T>] {
        return tee(this, n as number).map(RSIterator.new) as Tuple<RSIterator<T>, N>;
    }

    public uniqueEverseen(key?: (x: T) => any): RSIterator<T> {
        return RSIterator.new(uniqueEverseen(this, key));
    }
    public unique_everseen(key?: (x: T) => any): RSIterator<T> {
        return RSIterator.new(uniqueEverseen(this, key));
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
    <T, TReturn = any, TNext = undefined>() =>
    ({ prototype }: PrototypeIterable<T, TReturn, TNext>) => {
        addIterMethodToPrototype(prototype);
    };

export function addIterMethodToPrototype<T, TReturn = any, TNext = undefined>(
    proto: PrototypeIterable<T, TReturn, TNext>['prototype'],
) {
    Object.defineProperty(proto, 'iter', {
        value: function iter() {
            return RSIterator.new(this);
        },
        enumerable: false,
        writable: true,
        configurable: true,
    });
}

export interface PrototypeIterable<T, TReturn = any, TNext = undefined> {
    prototype: Iterable<T> | Generator<T, TReturn, TNext>;
}
