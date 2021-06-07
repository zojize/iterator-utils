import type { PrototypeIterable } from '../rs-iterator';
import { RSIterable } from '../rs-iterator';

declare global {
    interface DOMTokenList extends RSIterable<string> {}
}

makeRSIterableIfNotUndefined(globalThis.DOMTokenList);

function makeRSIterableIfNotUndefined(ctor: PrototypeIterable<unknown>): void {
    const makeRSIterable = RSIterable();
    typeof ctor !== 'undefined' && makeRSIterable(ctor);
}
