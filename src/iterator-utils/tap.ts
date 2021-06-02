import { iter } from './iter';

export function* tap<T>(func: (x: T) => void, it: Iterable<T>): Generator<T> {
    for (const item of iter(it)) {
        func(item);
        yield item;
    }
}
