import { range } from '../src';

describe('range()', () => {
    it('should be [0, 1, 2] for range(3)', () => {
        expect(Array.from(range(3))).toEqual([0, 1, 2]);
    });
});
