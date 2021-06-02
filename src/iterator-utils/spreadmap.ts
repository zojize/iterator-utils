import { ispreadMap } from './ispread-map';
import { list } from '../internal/utils';

export function spreadMap<T, A extends ReadonlyArray<T>, R>(
    func: (...args: A) => R,
    it: Iterable<A>,
): R[] {
    return list(ispreadMap(func, it));
}

export const spreadmap = spreadMap;
export const spread_map = spreadMap;
