import { repeat } from './repeat';
import { map } from './map';
import { iter } from './iter';
import { extractArgs, Kwargs, list } from '../internal/utils';
import type { Tuple, VoidOr } from '../internal/types';

export function* product<T, Kwargs_ extends Kwargs<{ repeat?: 1 }>>(
    ...args: [...Iterable<T>[], Kwargs_]
): Generator<Tuple<T, VoidOr<Kwargs_['kwargs']['repeat'], 1>>> {
    const [its, { repeat: _repeat = 1 } = { repeat: 1 }] = extractArgs(args);
    const pools = list(
        repeat(
            map((it) => list(iter(it)), its),
            _repeat,
        ),
    );
    let result = [[]] as Tuple<T, VoidOr<Kwargs_['kwargs']['repeat'], 1>>[];
    for (const pool of pools) {
        result = map((y) => map((x) => (x as T[]).concat(y), result), pool) as Tuple<
            T,
            VoidOr<Kwargs_['kwargs']['repeat'], 1>
        >[];
    }
    for (const prod of result) {
        yield prod;
    }
}
