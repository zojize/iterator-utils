import { isObjectOrFunction } from '../internal/utils';

declare global {
    interface SymbolConstructor {
        readonly reversedIterator: unique symbol;
    }

    interface Array<T> {
        [Symbol.reversedIterator](): Iterator<T>;
    }

    interface ReadonlyArray<T> {
        [Symbol.reversedIterator](): Iterator<T>;
    }

    interface String {
        [Symbol.reversedIterator](): IterableIterator<string>;
    }

    interface Int8Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }

    interface Int16Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }

    interface Uint16Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }

    interface Int32Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }

    interface Uint32Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }

    interface Float32Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }

    interface Float64Array {
        [Symbol.reversedIterator](): IterableIterator<number>;
    }
}

const REVERSED = Symbol('Symbol.reversedIterator');
// @ts-expect-error: assign to readonly
Symbol.reversedIterator = REVERSED;

export type Reversible<T> = { [Symbol.reversedIterator](): Iterator<T> };

export function isReversible<T>(obj: any): obj is Reversible<T> {
    return (
        obj &&
        isObjectOrFunction(obj) &&
        Symbol.reversedIterator in obj &&
        typeof obj[Symbol.reversedIterator] === 'function'
    );
}

function* reversedArrayLikeGenerator<T>(this: ArrayLike<T>): Generator<T> {
    for (let i = this.length - 1; i >= 0; i--) yield this[i];
}

Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
String.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Int8Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Uint8Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Int16Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Uint16Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Int32Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Uint32Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Float32Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
Float64Array.prototype[Symbol.reversedIterator] = reversedArrayLikeGenerator;
