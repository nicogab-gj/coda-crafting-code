import type { ServerResponse } from 'node:http'

// What a controller answers, written to the socket by the app
type HttpResponse = { statusCode: number; body: unknown }

function respondWithJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { 'content-type': 'application/json' })
  response.end(JSON.stringify(body))
}

export { respondWithJson, type HttpResponse }
