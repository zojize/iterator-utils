import { iter } from './iter';

export function allEqual(it: Iterable<unknown>): boolean {
    let last: unknown;
    for (const item of iter(it)) {
        if (typeof last === 'undefined') {
            last = item;
            continue;
        }
        if (last !== item) return false;
        last = item;
    }
    return true;
}

export const all_equal = allEqual;
