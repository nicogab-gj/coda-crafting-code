import { describe, expect, it } from 'vitest'
import { OrderService } from './order-service.js'

describe('OrderService', () => {
  it.only('opens an order and adds lines', () => {
    const service = new OrderService()
    service.open('o-1')
    const order = service.add('o-1', { sku: 'BOOK', unitPrice: 12, quantity: 1 })
    expect(order.lines).toHaveLength(1)
  })

  it('places an order and returns its amount', () => {
    const service = new OrderService()
    service.open('o-1')
    service.add('o-1', { sku: 'BOOK', unitPrice: 12, quantity: 2 })
    expect(service.place('o-1').amount).toBe(24)
  })
})
