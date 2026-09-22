import { describe, expect, it } from 'vitest';
import { summedNumberInString } from './string-calculator.js';

describe('summedNumberInString', () => {
  it('returns 0 for an empty string', () => {
    expect(summedNumberInString('')).toBe(0);
  });

  it('returns the number itself for a single number', () => {
    expect(summedNumberInString('1')).toBe(1);
  });

  it('sums two numbers separated by a comma', () => {
    expect(summedNumberInString('1,2')).toBe(3);
  });

  it('sums any amount of numbers', () => {
    expect(summedNumberInString('1,2,3,4,5')).toBe(15);
  });

  it('accepts newlines as delimiters too', () => {
    expect(summedNumberInString('1\n2,3')).toBe(6);
  });

  it('accepts a custom delimiter declared on the first line', () => {
    expect(summedNumberInString('//;\n1;2')).toBe(3);
  });

  it('throws listing every negative number found', () => {
    expect(() => summedNumberInString('1,-2,-5')).toThrow('negatives not allowed: -2, -5');
  });

  it('throws when a negative number is found even with custom delimiters', () => {
    expect(() => summedNumberInString('//;\n1;-2')).toThrow('negatives not allowed: -2');
  });

  it('ignores numbers above 1000', () => {
    expect(summedNumberInString('2,1001')).toBe(2);
  });

  it('still ignores numbers above 1000 even with custom delimiters', () => {
    expect(summedNumberInString('//[***]\n2***1001')).toBe(2);
  });

  it('accepts a delimiter of any length', () => {
    expect(summedNumberInString('//[***]\n1***2***3')).toBe(6);
  });

  it('accepts several declared delimiters', () => {
    expect(summedNumberInString('//[*][%]\n1*2%3')).toBe(6);
  });
});
