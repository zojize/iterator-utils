export function* successors<T>(first: T, succ: (x: T) => T): Generator<T> {
    let x = first;
    yield x;
    for (;;) yield (x = succ(x));
}
