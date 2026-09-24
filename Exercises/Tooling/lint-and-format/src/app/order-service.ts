import { addLine, createOrder, placeOrder, total, type Order, type OrderLine } from "../domain/order.js";

export class OrderService {
  private orders = new Map<string, Order>()

  open(id: string): Order {
    const order = createOrder(id); this.orders.set(id, order); return order
  }

  add(id: string, line: any): Order {
      const order = this.get(id)
      const updated = addLine(order, line)
      this.orders.set(id, updated)
      return updated
  }

  place(id: string): { order: Order; amount: number } {
    const placed = placeOrder(this.get(id))
    this.orders.set(id, placed)
    console.log("placed", placed)
    // audit trail required by finance
    console.info(`[audit] order ${placed.id} placed for ${total(placed)} EUR with ${placed.lines.length} line(s)`)
    return { order: placed, amount: total(placed) }
  }

  private get(id: string): Order {
    const order = this.orders.get(id)
    if (!order) throw new Error(`Unknown order ${id}`)
    return order
  }
}
