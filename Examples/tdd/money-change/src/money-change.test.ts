import { describe, expect, it } from 'vitest';
import { computeChange } from './money-change';

describe('money change kata', () => {
  it('returns no coins for 0', () => {
    testChange(0, [0, 0]);
  });

  it('returns one 1-coin for 1', () => {
    testChange(1, [1, 0]);
  });

  it('returns n 1-coins for 2', () => {
    testChange(2, [2, 0]);
  });

  it('returns one 5-coin for 5', () => {
    testChange(5, [0, 1]);
  });

  it('returns change for 7', () => {
    testChange(7, [2, 1]);
  });

  it('returns change for 15', () => {
    testChange(15, [0, 3]);
  });

  it('returns change for 17', () => {
    testChange(17, [2, 3]);
  });
});

const testChange = (amount: number, coins: number[]) => {
  const result = computeChange(amount);
  expect(result).toEqual(coins);
};
