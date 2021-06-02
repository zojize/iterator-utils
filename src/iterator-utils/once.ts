export function* once<T>(value: T): Generator<T> {
    yield value;
}
