import { describe, expect, it } from 'vitest';
import { manhattan } from './src/manhattan-distance';

describe('manhattan distance kata', () => {
  it('runs the test suite', () => {
    let distance = [7];
    const result = manhattan([0, 0], [3, 4]);
    expect(result).toEqual(distance)
  });


  it('runs the test suite', () => {
    let distance = [0, 0];
    const result = manhattan([0, 0], [0, 0]);
    expect(result).toEqual(distance)
  });


  it('runs the test suite', () => {
    let distance = [4];
    const result = manhattan([-1, -1], [1, 1]);
    expect(result).toEqual(distance)
  });
}); 
