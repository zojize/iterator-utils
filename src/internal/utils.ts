import {
    AnyFunc,
    CompFunc,
    Falsy,
    NegativeTypeGuard,
    NumberPredicateFunction,
    Optional,
    PredicateFunction,
    Slice,
    TypeGuard,
} from './types';

const objectOrFunction = new Set(['object', 'function'] as const);

export function isObjectOrFunction(objOrFunc: any): objOrFunc is Record<string, unknown> | AnyFunc {
    return objectOrFunction.has(typeof objOrFunc as any);
}

export function isIterable<T>(obj: any): obj is Iterable<T> {
    return (
        isObjectOrFunction(obj) &&
        Symbol.iterator in obj &&
        typeof obj[Symbol.iterator] === 'function'
    );
}

export function isIterator<T>(obj: any): obj is Iterator<T> {
    return 'next' in obj && typeof obj.next === 'function';
}

export function isIterableIterator<T>(obj: any): obj is IterableIterator<T> {
    return isIterable(obj) && isIterator(obj);
}

export function identity<T>(x: T): T {
    return x;
}

export const identityPredicate = Boolean;
export const identityTypeGuard = Boolean as unknown as <T>(x: T) => x is Exclude<T, Falsy>;

export function createTypeGuard<T, S extends T>(fn: PredicateFunction<T>): TypeGuard<T, S> {
    return fn as TypeGuard<T, S>;
}

export function fakeGuard<T>(x: unknown): x is T {
    return true;
}

export function numberIdentity<T>(x: T): number {
    if (typeof x !== 'number') {
        throw new Error('Inputs must be numbers');
    }
    return x;
}

export function add(a: number, b: number): number {
    return a + b;
}

export const list = Array.from;
export const tuple: <T>(iterable: Iterable<T> | ArrayLike<T>) => ReadonlyArray<T> = Array.from;

// https://github.com/nvie/itertools.js/blob/d92312ba11f358b77068fffddef38cf676a961d1/src/utils.js#L7
export function keyToCmp<T>(keyFn: NumberPredicateFunction<T>): CompFunc<T> {
    return (a: T, b: T) => {
        let ka = keyFn(a);
        let kb = keyFn(b);
        if (typeof ka === 'boolean' && typeof kb === 'boolean') {
            return ka === kb ? 0 : !ka && kb ? -1 : 1;
        } else if (typeof ka === 'number' && typeof kb === 'number') {
            return ka - kb;
        } else if (typeof ka === 'string' && typeof kb === 'string') {
            return ka === kb ? 0 : ka < kb ? -1 : 1;
        } else {
            return -1;
        }
    };
}

export function not<T, S extends T>(func: TypeGuard<T, S>): NegativeTypeGuard<T, S>;
export function not<T>(func: PredicateFunction<T>): PredicateFunction<T>;
export function not<T, S extends T>(
    func: TypeGuard<T, S> | PredicateFunction<T>,
): NegativeTypeGuard<T, S> | PredicateFunction<T> {
    return (x: T): x is Exclude<T, S> => !func(x);
}

export function interpretRange(r: Slice): [start: number, stop: number, step: number] {
    if (!r.length) throw TypeError('range expected at least 1 argument, got 0');
    let [start, stop, step = 1] = r;
    if (typeof stop === 'undefined') [stop, start] = [start, 0];
    for (const n of [start, stop, step])
        if (!Number.isInteger(n)) throw new TypeError(`'${n}' cannot be interpreted as an integer`);
    if (step === 0) throw new TypeError('range() arg 3 must not be zero');
    return [start, stop, step];
}

export function interpretSlice(slice: Slice): [start: number, stop: number, step: number] {
    for (const n of slice)
        if (!Number.isInteger(n) || n < 0)
            throw TypeError('islice arguments must all be positive integer');
    switch (slice.length) {
        // @ts-expect-error: check invalid input
        case 0:
            throw TypeError('slice expects 1-3 arguments, got 0');
        case 1:
            return [0, ...slice, 1];
        case 2:
            return [...slice, 1];
        default:
            if (slice[2] === 0) throw TypeError('step must not be zero');
            return slice;
    }
}

export const KWARGS = Symbol('KWARGS');

export class $Kwargs<Kws extends Record<string, any> = Record<string, any>> {
    public [KWARGS]: Kws;
    // 'kwargs' is not intended to be read directly
    constructor(public kwargs: Kws) {
        this[KWARGS] = kwargs;
    }
}

export type Kwargs<Kws extends Record<string, any> = Record<string, any>> = $Kwargs<Kws>;

export function Kwargs<Kws extends Record<string, any>>(kws: Kws): $Kwargs<Kws> {
    return new $Kwargs(kws);
}
export const kwargs = Kwargs;

// TODO: less verbose typing for extractArgs
export function extractArgs<Args extends ReadonlyArray<unknown>, Kws extends Record<string, any>>(
    args: [...Args, $Kwargs<Kws>],
): [Args, Kws];
export function extractArgs<Args extends ReadonlyArray<unknown>, Kws extends Record<string, any>>(
    args: [...Args, $Kwargs<Kws>?],
): [Args, Kws | undefined];
export function extractArgs<T, Args extends ReadonlyArray<T>>(args: [...Args]): [Args, void];
export function extractArgs<T, Args extends ReadonlyArray<T>, Kws, Kwargs_ extends $Kwargs<Kws>>(
    args: [...Args, Kwargs_],
): [Args, Kws];
export function extractArgs<T, Args extends ReadonlyArray<T>, Kws, Kwargs_ extends $Kwargs<Kws>>(
    args: [...Args, Kwargs_?],
): [Args, Optional<Kws>] {
    if (!args.length) return [[] as unknown as Args, null as unknown as Kws];
    let kwarg = {} as Kws;
    const _args: T[] = [];
    for (const arg of args) {
        if (arg instanceof $Kwargs) Object.assign(kwarg, arg[KWARGS]);
        else _args.push(arg as T);
    }
    return [_args as unknown as Args, kwarg];
}

export function extractKwargs<Kws>(kwargs?: $Kwargs<Kws> | Kws): Kws | undefined {
    if (kwargs) if (kwargs instanceof $Kwargs) return kwargs[KWARGS];
    return kwargs;
}

export function primitiveIdentity<T>(
    x: T,
): T extends number | string | boolean | bigint ? T : never {
    switch (typeof x) {
        case 'number':
        case 'string':
        case 'bigint':
        case 'boolean':
            return x as any;
    }
    throw TypeError(`${x} is not a primitive value`);
}

export function bind<T, N extends keyof T>(obj: T, methodName: N): T[N] {
    return Object.getPrototypeOf(obj)[methodName].bind(obj);
}

export function pop<T>(ls: T[]): () => T | undefined {
    return bind(ls, 'pop');
}
export function shift<T>(ls: T[]): () => T | undefined {
    return bind(ls, 'shift');
}

export function sameValueZero(a: unknown, b: unknown): boolean {
    return [a].includes(b);
}
