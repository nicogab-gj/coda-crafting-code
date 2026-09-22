import { describe, expect, it } from 'vitest'
import { primeFactors } from './prime-factors'

describe('prime factors kata', () => {
  it('return [] for 1', () => {
    expect(primeFactors(1)).toEqual([])
  })
  it('return [2] for 2', () => {
    expect(primeFactors(2)).toEqual([2])
  })
  it('return [3] for 3', () => {
    expect(primeFactors(3)).toEqual([3])
  })
  it('return [2, 2] for 4', () => {
   expect(primeFactors(4)).toEqual([2, 2])
  })
  it('return [5] for 5', () => {
    expect(primeFactors(5)).toEqual([5])
  })
  it('return [2,3] for 6', () => {
    expect(primeFactors(6)).toEqual([2, 3])
  })
  it('return [7] for 7', () => {
    expect(primeFactors(7)).toEqual([7])
  })
  it('return [2,2,2] for 8', () => {
    expect(primeFactors(8)).toEqual([2,2,2])
  })
  it('return [3,3,3] for 27', () => {
    expect(primeFactors(27)).toEqual([3,3,3])
  })
  it('return [2,2,3] for 12', () => {
    expect(primeFactors(12)).toEqual([2,2,3])
  })
})
