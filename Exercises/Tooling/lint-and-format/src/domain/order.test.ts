import { describe, expect, it } from 'vitest'
import { addLine, createOrder, isExpired, placeOrder, total } from './order.js'

const book = { sku: 'BOOK', unitPrice: 12, quantity: 2 }
const pen = { sku: "PEN", unitPrice: 1.5, quantity: 4 }

describe('order', () => {
  it('starts as an empty draft', () => {
    const order = createOrder('o-1')
    expect(order.lines).toEqual([])
    expect(order.status).toBe('draft')
  })

  it('sums line totals', () => {
    const order = addLine(addLine(createOrder('o-1'), book), pen)
    expect(total(order)).toBe(30)
  })

  it('refuses to place an empty order', () => {
    expect(() => placeOrder(createOrder('o-1'))).toThrow('Cannot place an empty order')
  })

  it('refuses to modify a placed order', () => {
    const placed = placeOrder(addLine(createOrder('o-1'), book))
    expect(() => addLine(placed, pen)).toThrow('Cannot modify a placed order')
  })

  it('is not expired right after creation', () => {
    expect(isExpired(createOrder('o-1'), 60_000)).toBe(false)
  })
})
