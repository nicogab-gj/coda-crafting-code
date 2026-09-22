export function manhattanDistance(
  point1: [number, number],
  point2: [number, number]
): number {
  return Math.abs(point2[0] - point1[0]) + Math.abs(point2[1] - point1[1])
}
