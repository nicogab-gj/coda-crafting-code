import { describe, expect, it } from 'vitest'
import { Checkout } from './checkout'

describe('checkout kata', () => {
  it('runs the test suite', () => {
    expect(true).toBe(true)
  })
  it('returns 50 for 1 apple', () => {
    const checkout = new Checkout()
    checkout.scan('apple')
    expect(checkout.total()).toBe(50)
  })
  it('returns 30 for 1 carrot', () => {
    const checkout = new Checkout()
    checkout.scan('carrot')
    expect(checkout.total()).toBe(30)
  })
  it('returns 60 for 2 carrot', () => {
    const checkout = new Checkout()
    checkout.scan('carrot')
    expect(checkout.total()).toBe(60)
  })
  
})

