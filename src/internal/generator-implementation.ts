export abstract class GeneratorImplementation<T, TReturn = void, TNext = never>
    implements Generator<T, TReturn, TNext>
{
    public done = false;
    public abstract iterator: Iterator<T, TReturn, TNext> | Iterator<T>;

    next(): IteratorResult<T> {
        if (this.done) return { value: void 0, done: true };
        const next = this.iterator.next();
        this.done = Boolean(next.done);
        return next;
    }

    throw(e: unknown): IteratorResult<T> {
        if ('throw' in this.iterator && typeof this.iterator.throw === 'function')
            return this.iterator.throw(e);
        throw e;
    }

    return(value?: TReturn): IteratorResult<T, TReturn> {
        if ('return' in this.iterator && typeof this.iterator.return === 'function')
            return this.iterator.return(value);
        return { value: void 0 as unknown as TReturn, done: true };
    }

    [Symbol.iterator](): this {
        return this;
    }
}