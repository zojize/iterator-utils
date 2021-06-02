import type { Slice } from '../internal/types';
import { interpretRange } from '../internal/utils';

const largerThanOrEqualTo = (a: number, b: number) => a >= b;
const lessThanOrEqualTo = (a: number, b: number) => a <= b;

class Range implements Iterable<number> {
    protected _len!: number;
    protected _sign!: number;

    constructor(public start: number, public stop: number, public step: number) {
        this.start = start;
        this.stop = stop;
        this.step = step;
    }

    public [Symbol.iterator](): RangeIterator {
        return new RangeIterator(this.start, this.stop, this.step);
    }

    // https://github.com/dcrosta/xrange/blob/cb2de1e7672f6534db5cd6148cb59d861702dc28/xrange.py#L79
    public [Symbol.reversedIterator](): RangeIterator {
        const last = this.start + (this.len - 1) * this.step;
        return new RangeIterator(last, this.start - this.sign, -1 * this.step);
    }

    protected get len() {
        return (
            this._len ??
            (this._len = Math.floor(
                (this.stop - this.start) / this.step +
                    +Boolean((this.stop - this.start) % this.step),
            ))
        );
    }

    protected get sign() {
        return this._sign ?? (this._sign = Math.sign(this.step));
    }
}

class RangeIterator extends Range implements IterableIterator<number> {
    protected _n: number;
    protected _compFunc: (a: number, b: number) => boolean;
    protected _done = false;

    constructor(public start: number, public stop: number, public step: number) {
        super(start, stop, step);
        this._n = this.start;
        this._compFunc = this.sign > 0 ? largerThanOrEqualTo : lessThanOrEqualTo;
        this.stop = stop;
        this.step = step;
    }

    public next(): IteratorResult<number> {
        if (this._done || this._compFunc(this._n, this.stop)) {
            this._done = true;
            return {
                value: undefined,
                done: true,
            };
        }
        const n = this._n;
        return { value: ((this._n += this.step), n) };
    }

    public [Symbol.iterator](): this {
        return this;
    }

    // todo: test this
    public [Symbol.reversedIterator](): RangeIterator {
        const last = this.start + (this.len - 1) * this.step;
        return new RangeIterator(last, this._n + this.step, -1 * this.step);
    }
}

export function range(stop: number): Range;
export function range(start: number, stop: number): Range;
export function range(start: number, stop: number, step: number): Range;
export function range(...args: Slice): Range {
    let [n, stop, step] = interpretRange(args);
    return new Range(n, stop, step);
}
