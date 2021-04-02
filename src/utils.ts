import { any } from './builtins';
import {
    CompFunc,
    NumberPredicateFunction,
    Optional,
    PredicateFunction,
    Slice,
} from './types';

export function identity<T>(x: T): T {
    return x;
}

export const identityPredicate = Boolean;

export function numberIdentity<T>(x: T): number {
    if (typeof x !== 'number') {
        throw new Error('Inputs must be numbers');
    }
    return x;
}

export function add(a: number, b: number): number {
    return a + b;
}

// https://github.com/nvie/itertools.js/blob/d92312ba11f358b77068fffddef38cf676a961d1/src/utils.js#L7
export function keyToCmp<T>(keyFn: NumberPredicateFunction<T>): CompFunc<T> {
    return (a: T, b: T) => {
        let ka = keyFn(a);
        let kb = keyFn(b);
        // istanbul ignore else
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

export function not<T>(func: PredicateFunction<T>): PredicateFunction<T> {
    return (x) => !func(x);
}

export function interpretRange(
    r: Slice,
): [start: number, stop: number, step: number, inc: boolean] {
    let [start, end, step = 1] = r;
    if (typeof end === 'undefined') [end, start] = [start, 0];
    for (const n of [start, end, step])
        if (!Number.isInteger(n)) throw new TypeError(`'${n}' cannot be interpreted as an integer`);
    if (step === 0) throw new TypeError('range() arg 3 must not be zero');
    const inc = step > 0;
    return [start, end, step, inc];
}

export function interpretSlice(slice: Slice): [start: number, stop: number, step: number] {
    if (any(slice, (n) => !Number.isInteger(n) || n < 0))
        throw TypeError('islice arguments must all be positive integer');
    switch (slice.length) {
        case 1:
            return [0, ...slice, 1];
        case 2:
            return [...slice, 1];
        case 3:
            if (slice[2] === 0) throw TypeError('step must not be zero');
            return slice;
        default:
            throw TypeError(`slice expects 1-3 arguments, got ${(slice as any).length}`);
    }
}

const KWARGS = Symbol('kwargs');
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
export function extractArgs<T, Args extends ReadonlyArray<T>>(
    args: [...Args],
): [Args, void];
export function extractArgs<T, Args extends ReadonlyArray<T>, Kws, Kwargs_ extends $Kwargs<Kws>>(
    args: [...Args, Kwargs_],
): [Args, Kws];
export function extractArgs<T, Args extends ReadonlyArray<T>, Kw, Kwargs_ extends $Kwargs<Kw>>(
    args: [...Args, Kwargs_?],
): [Args, Optional<Kw>] {
    if (!args.length) return [([] as unknown) as Args, (null as unknown) as Kw];
    let kwarg: Optional<Kw>;
    const _args: T[] = [];
    for (const arg of args) {
        if (arg instanceof $Kwargs) kwarg = arg[KWARGS];
        else _args.push(arg as T);
    }
    return [(_args as unknown) as Args, kwarg];
}
