import { isIterable, sameValueZero } from '../internal/utils';
import { GeneratorImplementation } from '../internal/generator-implementation';

export class Iter<T, TReturn = any, TNext = undefined>
    extends GeneratorImplementation<T, TReturn, TNext>
    implements Generator<T, TReturn, TNext>
{
    public iterator: Iterator<T>;

    constructor(it: Iterable<T>);
    constructor(func: (...args: unknown[]) => T, sentinel: T);
    constructor(...args: [it: Iterable<T>] | [func: (...args: unknown[]) => T, sentinel: T]) {
        super();
        if (args.length === 1) {
            const [it] = args;
            switch (typeof it) {
                case 'string': {
                    this.iterator = (it as Iterable<T>)[Symbol.iterator]();
                    break;
                }
                case 'function':
                case 'object': {
                    if (it && isIterable(it)) {
                        this.iterator = it[Symbol.iterator]();
                        break;
                    }
                }
                default: {
                    throw new TypeError(`${it} is not iterable`);
                }
            }
        } else if (args.length >= 2) {
            const [func, sentinel] = args;
            this.iterator = {
                next(): IteratorResult<T> {
                    const value = func();
                    return { value, done: sameValueZero(value, sentinel) };
                },
            };
        } else {
            throw TypeError('iter expected at least 1 argument, got 0');
        }
    }
}

export function iter<T>(it: Iterable<T>): Iter<T>;
export function iter<T, U>(func: (...args: unknown[]) => T, sentinel: U): Iter<Exclude<T, U>>;
export function iter<T>(func: (...args: unknown[]) => T, sentinel: T): Iter<T>;
export function iter<T>(
    ...args: [it: Iterable<T>] | [func: (...args: unknown[]) => T, sentinel: T]
): Iter<T> {
    // TODO
    // @ts-expect-error: fix typing here
    return new Iter(...args);
}
