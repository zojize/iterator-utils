export function* repeat<O>(object: O, times = Number.POSITIVE_INFINITY): Generator<O> {
    for (let i = 0; i < times; i++) yield object;
}
