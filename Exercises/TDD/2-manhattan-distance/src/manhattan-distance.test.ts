import { describe, expect, it } from 'vitest';
import { manhattanDistance } from './manhattan-distance';

describe('manhattan distance kata', () => {
  it('runs the test suite', () => {
    expect(true).toBe(true);
  });
  it('returns 0 for the same point', () => {
    expect(manhattanDistance([0, 0], [0, 0])).toBe(0);
  });
   it('returns 1 when moving horizontally', () => {
    expect(manhattanDistance([0, 0], [1, 0])).toBe(1)
  })

  it('returns 1 when moving vertically', () => {
    expect(manhattanDistance([0, 0], [0, 1])).toBe(1)
  })

  it('returns 3 when moving vertically', () => {
    expect(manhattanDistance([0, 0], [0, 3])).toBe(3)
  })
  it('returns 4 when moving vertically', () => {
    expect(manhattanDistance([0, 0], [4, 0])).toBe(4)
  })
  it('returns 7 when moving vertically', () => {
    expect(manhattanDistance([0, 0], [3, 4])).toBe(7)
  })
  it('returns 7 when moving vertically', () => {
    expect(manhattanDistance([3, 4], [0, 0])).toBe(7)
  })
  it('returns 4 when moving vertically', () => {
    expect(manhattanDistance([-1, -1], [1, 1])).toBe(4)
  })
  it('returns 15 when moving vertically', () => {
    expect(manhattanDistance([2, -5], [-3, 5])).toBe(15)
  })
});


