export function* take<T>(n: number, it: Iterator<T>): Generator<T> {
    for (let i = 0; i < n; i++) {
        const next = it.next();
        if (next.done) return;
        yield next.value;
    }
}
