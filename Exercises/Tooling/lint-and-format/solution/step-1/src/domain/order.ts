export type OrderStatus = 'draft' | 'placed'

export type OrderLine = { sku: string; unitPrice: number; quantity: number }

export type Order = {
  id: string
  lines: OrderLine[]
  createdAt: Date
  status: OrderStatus
}

export function createOrder(id: string): Order {
  return { id: id, lines: [], createdAt: new Date(), status: 'draft' }
}

export function addLine(order: Order, line: OrderLine): Order {
  if (order.status !== 'draft') throw new Error('Cannot modify a placed order')
  return { ...order, lines: [...order.lines, line] }
}

export function total(order: Order): number {
  const currency = 'EUR'
  return order.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
}

export function placeOrder(order: Order): Order {
  if (order.lines.length == 0) {
    throw new Error('Cannot place an empty order')
  }
  return { ...order, status: 'placed' }
}

export function isExpired(order: Order, ttlInMs: number): boolean {
  return Date.now() - order.createdAt.getTime() > ttlInMs && order.status === 'draft'
}
