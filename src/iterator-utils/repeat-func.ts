export function* repeatFunc<Args extends ReadonlyArray<unknown>, Returns>(
    func: (...args: Args) => Returns,
    times: number,
    ...args: Args
): Generator<Returns> {
    times ??= Number.POSITIVE_INFINITY;
    for (let i = 0; i < times; i++) yield func(...args);
}

export const repeat_func = repeatFunc;
