import { createServer, type Server } from 'node:http'
import type { AccountController } from './controllers/account-controller.ts'
import { respondWithJson } from './http.ts'

type Health = { status: 'ok'; uptimeInSeconds: number }

const ACCOUNT_BALANCE_PATH = /^\/accounts\/(\d+)\/balance$/

function createApp(accountController: AccountController): Server {
  return createServer(async (request, response) => {
    try {
      if (request.method === 'GET' && request.url === '/health') {
        const health: Health = { status: 'ok', uptimeInSeconds: Math.floor(process.uptime()) }

        respondWithJson(response, 200, health)
        return
      }

      const accountBalancePath = request.url?.match(ACCOUNT_BALANCE_PATH)
      if (request.method === 'GET' && accountBalancePath?.[1] !== undefined) {
        const { statusCode, body } = await accountController.getBalance(accountBalancePath[1])

        respondWithJson(response, statusCode, body)
        return
      }

      respondWithJson(response, 404, { error: 'Not found' })
    } catch (error) {
      console.error(error)
      respondWithJson(response, 500, { error: 'Internal server error' })
    }
  })
}

export { createApp }
