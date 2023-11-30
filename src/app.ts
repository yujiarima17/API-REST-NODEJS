import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import {env} from './env'
import cookie from '@fastify/cookie'
export const app = fastify()

app.register(cookie)
// fastify plugins
app.register(transactionsRoutes,{
  prefix:'transactions'
})