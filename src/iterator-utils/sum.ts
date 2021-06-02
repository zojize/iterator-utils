import { ireduce } from './ireduce';
import { add } from '../internal/utils';

export function sum(it: Iterable<number>): number {
    return ireduce(it, add);
}
