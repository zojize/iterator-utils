import { iter } from './iter';

export function* roundrobin<T>(...its: Iterable<T>[]): Generator<T> {
    const iterators = its.map<Iterator<T>>(iter);
    let activeIts = iterators.length;
    while (activeIts) {
        for (let i = 0; i < activeIts; i++) {
            const next = iterators[i].next();
            if (next.done) {
                iterators.splice(i, 1);
                activeIts--;
                i--;
                continue;
            }
            yield next.value;
        }
    }
}
