import { RSIterable, addIterMethodToPrototype } from '../rs-iterator';

declare global {
    interface Array<T> extends RSIterable<T> {}
    interface ReadonlyArray<T> extends RSIterable<T> {}

    interface Map<K, V> extends RSIterable<[K, V]> {}
    interface ReadonlyMap<K, V> extends RSIterable<[K, V]> {}

    interface Set<T> extends RSIterable<T> {}
    interface ReadonlySet<T> extends RSIterable<T> {}

    interface String extends RSIterable<string> {}

    interface Int8Array extends RSIterable<number> {}
    interface Uint8Array extends RSIterable<number> {}
    interface Uint8ClampedArray extends RSIterable<number> {}

    interface Int16Array extends RSIterable<number> {}
    interface Uint16Array extends RSIterable<number> {}

    interface Int32Array extends RSIterable<number> {}
    interface Uint32Array extends RSIterable<number> {}

    interface Float32Array extends RSIterable<number> {}

    interface Float64Array extends RSIterable<number> {}

    // ? internal iterators, implement them or not?
    // TODO: Array Iterators, e.g. return type of [].keys, [].entries (needs better typing)
    // TODO: Map Iterators, e.g. return type of new Map().keys, new Map().entries (needs better typing)

    // TODO: Map, TypedArrays, And other iterable builtin objects
}

const makeRSIterable = RSIterable();

// basic data structures
makeRSIterable(Array);
makeRSIterable(Map);
makeRSIterable(Set);
makeRSIterable(String);

// internal iterators
// ? should I do this?
addIterMethodToPrototype(Object.getPrototypeOf([].keys()));
addIterMethodToPrototype(Object.getPrototypeOf(new Map().keys()));
addIterMethodToPrototype(Object.getPrototypeOf(new Set().keys()));

// typed arrays
makeRSIterable(Int8Array);
makeRSIterable(Uint8Array);
makeRSIterable(Uint8ClampedArray);

makeRSIterable(Int16Array);
makeRSIterable(Uint16Array);

makeRSIterable(Int32Array);
makeRSIterable(Uint32Array);

makeRSIterable(Float32Array);

makeRSIterable(Float64Array);
