import { skip } from './skip';
import { repeat } from './repeat';
import { zip } from './zip';
import { flatten } from './flatten';

export function intersperse<T, Fill>(item: Fill, it: Iterable<T>): Generator<T | Fill> {
    return skip(1, flatten(zip(repeat(item), it)));
}
