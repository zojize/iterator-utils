export function* count(start = 0, step = 1): Generator<number> {
    for (;;) yield (start += step) - 1;
}
