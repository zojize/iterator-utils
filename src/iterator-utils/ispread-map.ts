import { imap } from './imap';

export function ispreadMap<A extends readonly unknown[], R>(
    func: (...args: A) => R,
    it: Iterable<A>,
): Generator<R> {
    return imap((args) => func(...args), it);
}

export const ispreadmap = ispreadMap;
export const ispread_map = ispreadMap;
