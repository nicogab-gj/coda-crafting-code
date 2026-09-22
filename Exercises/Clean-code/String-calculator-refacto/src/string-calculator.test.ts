import { describe, expect, it } from 'vitest';
import { add } from './string-calculator.js';

describe('add', () => {
  it('returns 0 for an empty string', () => {
    expect(add('')).toBe(0);
  });

  it('returns the number itself for a single number', () => {
    expect(add('1')).toBe(1);
  });

  it('sums two numbers separated by a comma', () => {
    expect(add('1,2')).toBe(3);
  });

  it('sums any amount of numbers', () => {
    expect(add('1,2,3,4,5')).toBe(15);
  });

  it('accepts newlines as delimiters too', () => {
    expect(add('1\n2,3')).toBe(6);
  });

  it('accepts a custom delimiter declared on the first line', () => {
    expect(add('//;\n1;2')).toBe(3);
  });

  it('throws listing every negative number found', () => {
    expect(() => add('1,-2,-5')).toThrow('les négatifs ne sont pas autorisés: -2, -5');
  });

  it('throws when a negative number is found even with custom delimiters', () => {
    expect(() => add('//;\n1;-2')).toThrow('les négatifs ne sont pas autorisés: -2');
  });

  it('ignores numbers above 1000', () => {
    expect(add('2,1001')).toBe(2);
  });

  it('still ignores numbers above 1000 even with custom delimiters', () => {
    expect(add('//[***]\n2***1001')).toBe(2);
  });

  it('accepts a delimiter of any length', () => {
    expect(add('//[***]\n1***2***3')).toBe(6);
  });

  it('accepts several declared delimiters', () => {
    expect(add('//[*][%]\n1*2%3')).toBe(6);
  });
});
