import { describe, expect, it } from 'vitest';

describe('string calculator kata', () => {
  it('is the function defined', () => {
    expect(calculateString).toBeDefined;
  });
  it('An empty string returns 0', () => {
    expect(calculateString("")).toEqual(0);
  });
  it('One number returns its value', () => {
    expect(calculateString("1")).toEqual(1);
  });
  it('Two numbers, comma separated, are summed', () => {
    expect(calculateString('1,2')).toEqual(3);
  });

  it('Any amount of numbers is allowed', () => {
    expect(calculateString('1,2,3,4,5')).toEqual(15);
  });

  it('Newlines are delimiters too', () => {
    expect(calculateString('1\n2,3')).toEqual(15);
  });
});

function calculateString(n):number {
  if(n.length === 0){
    return 0
  }

  const result: number[] = n.split(',').map(Number)

  return result.reduce((sum, value) => sum + value, 0)
}

