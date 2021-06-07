import { AnyFunc } from '../internal/types';

interface Iterable_<T, TReturn, TNext> {
    [Symbol.iterator](): Iterator<T, TReturn, TNext>;
}

const isIterable_ = <T, TReturn, TNext>(it: any): it is Iterable_<T, TReturn, TNext> =>
    Symbol.iterator in it && typeof it[Symbol.iterator] === 'function';

export function iforEach<T, TReturn, TNext>(
    it: Iterator<T, TReturn, TNext>,
    cb: (item?: T, return_?: typeof it.return) => TNext,
): TReturn | undefined;
export function iforEach<T, TReturn, TNext>(
    it: Iterable_<T, TReturn, TNext>,
    cb: (
        item?: T,
        return_?: ((value?: TReturn | undefined) => IteratorResult<T, TReturn>) | undefined,
    ) => TNext,
): TReturn | undefined;
export function iforEach<T, TReturn, TNext>(
    it: Iterable_<T, TReturn, TNext> | Iterator<T, TReturn, TNext>,
    cb: (item?: T, return_?: AnyFunc) => TNext,
): TReturn | undefined {
    if (isIterable_(it)) it = it[Symbol.iterator]();

    let res = it.next();
    let tNext: TNext;

    for (;;) {
        if (res.done) break;
        try {
            tNext = cb(res.value, it.return);
            res = it.next(tNext!);
        } catch (e) {
            if (typeof it.throw === 'function') res = it.throw(e);
            else throw e;
        }
    }
    return res.value;
}

export const ifor_each = iforEach;
