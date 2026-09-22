import { describe, expect, it } from 'vitest'
import { Facteurpremier } from './Facteurpremier';

describe('prime factors kata', () => {
  it('runs the test suite', () => {

    const result = Facteurpremier(1)
    expect(result).toEqual([])
  })

  it('runs the test suite', () => {
    const result = Facteurpremier(2)
    expect(result).toEqual([2])
  })

  it('runs the test suite', () => {
    const result = Facteurpremier(4)
    expect(result).toEqual([2, 2])
  })

  it('runs the test suite', () => {
    const result = Facteurpremier(9)
    expect(result).toEqual([3, 3])
  })


  it('runs the test suite', () => {
    const result = Facteurpremier(12)
    expect(result).toEqual([2, 2, 3])
  })

  it('runs the test suite', () => {
    const result = Facteurpremier(60)
    expect(result).toEqual([2, 2, 3, 5])
  })


})