import { iter } from './iter';
import { bind } from '../internal/utils';


export function exhaustArray<T>(arr: T[], method: 'pop' | 'shift' = 'shift'): IterableIterator<T> {
    return iter(bind(arr, method), undefined);
}

export const exhaust_array = exhaustArray;
