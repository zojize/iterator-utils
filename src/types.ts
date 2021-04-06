import { REVERSED } from './symbols';

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
    | Generator<T, TReturn, TNext>;

export type UnpackIterable<A extends ReadonlyArray<unknown>> = A extends [
    infer First,
    ...infer Rest
]
    ? [First extends CanIter<infer T> ? T : First, ...UnpackIterable<Rest>]
    : [];

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
export type NumberPredicateFunction<T> = (x: T) => number;
export type CompFunc<T> = (a: T, b: T) => number;
export type AnyFunc = (...args: any[]) => any;

export type Slice =
    | [stop: number]
    | [start: number, stop: number]
    | [start: number, stop: number, step: number];

export type Optional<T> = T | void;
export type VoidOr<T, V> = T extends void ? V : T;

export type Reversible<T> = { [REVERSED](): Generator<T> };

// there is probably a better way to write this
export type IsUnknown<T> = T | unknown extends T
    ? Exclude<T extends '' ? true : false, false> extends never
        ? true
        : false
    : false;
