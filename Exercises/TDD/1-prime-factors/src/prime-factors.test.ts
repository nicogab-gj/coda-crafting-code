import { describe, expect, it } from 'vitest';

describe('prime factors kata', () => {
  it('runs the test suite', () => {
    expect(true).toBe(true);
  });

  it('returns the prime factors of 1', () => {
    expect(getPrimeFactors(1)).toEqual([]);
  });

  it('returns the prime factors of 2', () => {
    expect(getPrimeFactors(2)).toEqual([2]);
  });

  it('returns the prime factors of 3', () => {
    expect(getPrimeFactors(3)).toEqual([3]);
  });
});

const getPrimeFactors = (n: number): number[] => {
  if (n === 2) {
    return [2];
  }
  if (n === 3) {
    return [3];
  }
  return [];
};
