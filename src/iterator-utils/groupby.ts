import { iter } from './iter';
import { identity } from '../internal/utils';

class GroupBy<T, R = T> implements IterableIterator<[T | R, Generator<T | R>]> {
    protected _keyFunc: (x: T) => R;
    protected _it: IterableIterator<T>;
    protected _TGTKey: T | R;
    protected _currKey: T | R;
    protected currVal: T;
    protected _id!: symbol;

    constructor(it: Iterable<T>, key: (x: T) => R = identity as (x: T) => R) {
        this._it = iter(it);
        this._keyFunc = key;
        this._TGTKey = this._currKey = this.currVal = {} as T;
    }

    public [Symbol.iterator]() {
        return this;
    }

    public next(): IteratorResult<[T | R, Generator<T | R>]> {
        this._id = Symbol();
        while (this._currKey === this._TGTKey) {
            const next = this._it.next();
            if (next.done) return { value: undefined, done: true };
            this.currVal = next.value;
            this._currKey = this._keyFunc(this.currVal);
        }
        this._TGTKey = this._currKey;
        return {
            value: [this._currKey, this._grouper(this._TGTKey, this._id)],
        };
    }

    private *_grouper(TGTKey: T | R, id: symbol): Generator<T | R> {
        while (this._id === id && this._currKey === TGTKey) {
            yield this.currVal;
            const next = this._it.next();
            if (next.done) return;
            this.currVal = next.value;
            this._currKey = this._keyFunc(this.currVal);
        }
    }
}

export function groupby<T>(it: Iterable<T>): GroupBy<T, T>;
export function groupby<T, R = T>(it: Iterable<T>, key?: (x: T) => R): GroupBy<T, R>;
export function groupby<T, R>(it: Iterable<T>, key?: (x: T) => T | R): GroupBy<T, T | R> {
    return new GroupBy(it, key ?? identity);
}
