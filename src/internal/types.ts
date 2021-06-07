// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-513116547
export type PushFront<TailT extends any[], FrontT> = ((
    ...args: [FrontT, ...TailT]
) => any) extends (...tuple: infer TupleT) => any
    ? TupleT
    : never;

export type Tuple<ElementT, LengthT extends number, OutputT extends any[] = []> = {
    0: OutputT;
    1: Tuple<ElementT, LengthT, PushFront<OutputT, ElementT>>;
}[OutputT['length'] extends LengthT ? 0 : 1];

export type CanIter<T, TReturn = unknown, TNext = undefined> =
    | Iterable<T>
    | Iterator<T, TReturn, TNext>
    | IterableIterator<T>
    | Generator<T, TReturn, TNext>;

type Shifted<Arr extends readonly unknown[]> = Arr extends [any, ...infer Shifted] ? Shifted : [];
type Pushed<Arr extends any[], Item> = [...Arr, Item];

export type Zipped<A extends readonly Iterable<unknown>[], Res extends unknown[] = []> = {
    out: Res;
    rec: A[0] extends Iterable<infer T> ? Zipped<Shifted<A>, Pushed<Res, T>> : never;
}[A['length'] extends 0 ? 'out' : 'rec'];

export type OptionalTuple<A extends ReadonlyArray<unknown>, Val = void> = A extends [
    infer First,
    ...infer Rest
]
    ? [First | Val, ...OptionalTuple<Rest, Val>]
    : [];

export type Last<A extends ReadonlyArray<unknown>> = A extends [...any[], infer Last]
    ? Last
    : never;

export type AnyPredicateFunction<T> = (x: T) => any;
export type PredicateFunction<T> = (x: T) => boolean;
export type TypeGuard<T, S extends T> = (x: T) => x is S;
export type NegativeTypeGuard<T, S extends T> = (x: T) => x is Exclude<T, S>;
export type NumberPredicateFunction<T> = (x: T) => number;
export type CompFunc<T> = (a: T, b: T) => number;
export type AnyFunc = (...args: any[]) => any;

export type Slice =
    | [stop: number]
    | [start: number, stop: number]
    | [start: number, stop: number, step: number];

export type Optional<T> = T | void;
export type Maybe<T> = T | undefined;
export type VoidOr<T, V> = T extends void ? V : T;

// there is probably a better way to write this
export type IsUnknown<T> = T | unknown extends T
    ? Exclude<T extends '' ? true : false, false> extends never
        ? true
        : false
    : false;

export type Falsy = false | 0 | 0n | void | '';
