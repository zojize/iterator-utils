/**
 * test dataset from ↓
 * https://github.com/python/cpython/blob/master/Lib/test/test_itertools.py
 */

import {
    accumulate,
    chain,
    range,
    iter,
    zip,
    compress,
    repeat,
    count,
    permutations,
    reversed,
    combinations,
    combinationsWithReplacement,
    chunked,
    tail,
    zipLongest,
    kwargs,
    Kwargs,
    roundrobin,
    uniqueEverseen,
} from '../src';
import { list, lrange, ltake, lzip } from './test-utils';

describe('iter', () => {
    it('iter("foo")', () => {
        expect(list(iter('foo'))).toEqual(list('foo'));
    });
    it('iter([1, 2, 3])', () => {
        expect(list(iter([1, 2, 3]))).toEqual([1, 2, 3]);
    });
});

describe('range', () => {
    it('range(3)', () => {
        expect(lrange(3)).toEqual([0, 1, 2]);
    });
    it('range(10, 0, -1)', () => {
        expect(lrange(10, 0, -1)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });
    it('range(0, 10, 2)', () => {
        expect(lrange(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });
    it('range(0)', () => {
        expect(lrange(0)).toEqual([]);
    });
    it('range(-5, 5, 2)', () => {
        expect(lrange(-5, 5, 2)).toEqual([-5, -3, -1, 1, 3]);
    });
    it('range()', () => {
        // @ts-expect-error: should throw
        expect(() => range()).toThrow(TypeError);
    });
    it('range(1.5, 10.5)', () => {
        expect(() => range(1.5, 10.5)).toThrow(TypeError);
    });
    it('range(0, 5, 0.5)', () => {
        expect(() => range(0, 5, 0.5)).toThrow(TypeError);
    });
});

describe('zip', () => {
    it('zip("ABCD", "1234")', () => {
        expect(list(zip('ABCD', '1234'))).toEqual([
            ['A', '1'],
            ['B', '2'],
            ['C', '3'],
            ['D', '4'],
        ]);
    });
    it('zip("ABCD", "123456")', () => {
        expect(list(zip('ABCD', '123456'))).toEqual([
            ['A', '1'],
            ['B', '2'],
            ['C', '3'],
            ['D', '4'],
        ]);
    });
    it('zip("ABCD", "1234", "5678")', () => {
        expect(list(zip('ABCD', '1234', '5678'))).toEqual([
            ['A', '1', '5'],
            ['B', '2', '6'],
            ['C', '3', '7'],
            ['D', '4', '8'],
        ]);
    });
    it('zip()', () => {
        expect(list(zip())).toEqual([]);
    });
});

describe('accumulate', () => {
    it('list(accumulate(range(10)))', () => {
        expect(list(accumulate(range(10)))).toEqual([0, 1, 3, 6, 10, 15, 21, 28, 36, 45]);
    });
    it('list(accumulate("abc"))', () => {
        expect(list(accumulate('abc'))).toEqual(['a', 'ab', 'abc']);
    });
    it('list(accumulate([]))', () => {
        expect(list(accumulate([]))).toEqual([]);
    });
    it('list(accumulate([42]))', () => {
        expect(list(accumulate([42]))).toEqual([42]);
    });
    const s = [2, 8, 9, 5, 7, 0, 3, 4, 1, 6];
    it('list(accumulate(s, min))', () => {
        expect(list(accumulate(s, Math.min))).toEqual([2, 2, 2, 2, 2, 0, 0, 0, 0, 0]);
    });
    it('list(accumulate(s, max))', () => {
        expect(list(accumulate(s, Math.max))).toEqual([2, 8, 9, 9, 9, 9, 9, 9, 9, 9]);
    });
    it('list(accumulate(s, multiply)', () => {
        expect(list(accumulate(s, (a, b) => a * b))).toEqual(
            //
            [2, 16, 144, 720, 5040, 0, 0, 0, 0, 0],
        );
    });
});

describe('chain', () => {
    it('chain("abc", "def")', () => {
        expect(list(chain('abc', 'def'))).toEqual(list('abcdef'));
    });
    it('chain("abc")', () => {
        expect(list(chain('abc'))).toEqual(list('abc'));
    });
    it('chain("")', () => {
        expect(list(chain(''))).toEqual([]);
    });
    it('take(4, chain("abc", "def"))', () => {
        expect(ltake(4, chain('abc', 'def'))).toEqual(list('abcd'));
    });
    it('chain(4, 2)', () => {
        // @ts-expect-error: should throw
        expect(() => list(chain(4, 2))).toThrow(TypeError);
    });
});

describe('chain_from_iterable', () => {
    it('chain.fromIterable(["abc", "def"])', () => {
        expect(list(chain.fromIterable(['abc', 'def']))).toEqual(list('abcdef'));
    });
    it('chain.fromIterable(["abc"])', () => {
        expect(list(chain.fromIterable(['abc']))).toEqual(list('abc'));
    });
    it('chain.fromIterable([""])', () => {
        expect(list(chain.fromIterable(['']))).toEqual([]);
    });
    it('take(4, chain.fromIterable(["abc", "def"]))', () => {
        expect(ltake(4, chain.fromIterable(['abc', 'def']))).toEqual(list('abcd'));
    });
    it('chain.fromIterable([4, 2])', () => {
        // @ts-expect-error: should throw
        expect(() => list(chain.fromIterable([4, 2]))).toThrow(TypeError);
    });
});

describe('compress', () => {
    it('compress("ABCDEF", [1, 0, 1, 0, 1, 1])', () => {
        expect(list(compress('ABCDEF', [1, 0, 1, 0, 1, 1]))).toEqual(list('ACEF'));
    });
    it('compress("ABCDEF", [0, 0, 0, 0, 0, 0])', () => {
        expect(list(compress('ABCDEF', [0, 0, 0, 0, 0, 0]))).toEqual(list(''));
    });
    it('compress("ABCDEF", [1, 1, 1, 1, 1, 1])', () => {
        expect(list(compress('ABCDEF', [1, 1, 1, 1, 1, 1]))).toEqual(list('ABCDEF'));
    });
    it('compress("ABCDEF", [1, 0, 1])', () => {
        expect(list(compress('ABCDEF', [1, 0, 1]))).toEqual(list('AC'));
    });
    it('compress("ABC", [0, 1, 1, 1, 1, 1])', () => {
        expect(list(compress('ABC', [0, 1, 1, 1, 1, 1]))).toEqual(list('BC'));
    });
    it('compress("ABC", [0, 1, 1, 1, 1, 1])', () => {
        expect(list(compress('ABC', [0, 1, 1, 1, 1, 1]))).toEqual(list('BC'));
    });
    const n = 10000;
    const data = chain.fromIterable(repeat(lrange(6), n));
    const selectors = chain.fromIterable(repeat([0, 1] as const));
    it('compress(data, selectors)', () => {
        expect(list(compress(data, selectors))).toEqual(
            list(chain.fromIterable(repeat([1, 3, 5], n))),
        );
    });
});

describe('count', () => {
    it('lzip("abc", count())', () => {
        expect(lzip('abc', count())).toEqual([
            ['a', 0],
            ['b', 1],
            ['c', 2],
        ]);
    });
    it('lzip("abc", count(3))', () => {
        expect(lzip('abc', count(3))).toEqual([
            ['a', 3],
            ['b', 4],
            ['c', 5],
        ]);
    });
    it('take(2, lzip("abc",count(3)))', () => {
        expect(ltake(2, lzip('abc', count(3)))).toEqual([
            ['a', 3],
            ['b', 4],
        ]);
    });
    it('take(2, zip("abc",count(-1))', () => {
        expect(ltake(2, zip('abc', count(-1)))).toEqual([
            ['a', -1],
            ['b', 0],
        ]);
    });
    it('take(2, zip("abc",count(-3))', () => {
        expect(ltake(2, zip('abc', count(-3)))).toEqual([
            ['a', -3],
            ['b', -2],
        ]);
    });
    // console.log('comb', list(reversed(range(2))))
    console.log('per', list(permutations(range(3))));
    console.log('comb', list(combinations('ABCD', 2)));
    console.log('comb with rep', list(combinationsWithReplacement('ABC', 2)));
    console.log('chunked', list(chunked(range(10), 2)));
    console.log('chunked', list(chunked(lrange(11), 2, { strict: false })));
    console.log('tail', list(tail(3, 'ABCDEFG')));
});
