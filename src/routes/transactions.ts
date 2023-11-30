import { FastifyInstance } from "fastify"

import { knex } from '../database'

import { randomUUID } from 'node:crypto'

import { z} from 'zod'

import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

// Cookies <--> Formas de manter contexto entre requisições feitas pelo lado do cliente
export async function transactionsRoutes (app : FastifyInstance){
  // preHandler - middleware - interceptador
  // handler apenas para essse plugin
  app.addHook('preHandler',async(request,reply)=>{

  })
  app.get('/summary',{preHandler:[checkSessionIdExists]},async (request)=>{

    const {sessionId} = request.cookies
    const summary = await knex('transactions').where('session_id',sessionId).sum('amount',{as:'amount'}).first()
    
    return {summary}
  })

  app.get('/',{preHandler:[checkSessionIdExists]},async(request,reply)=>{

    const {sessionId }= request.cookies
    const transactions = await knex('transactions').where('session_id',sessionId).select()
    
    return {transactions}
  })

  app.get('/:id',{preHandler:[checkSessionIdExists]},async (request)=>{
    
    const getTransactionsParamsSchema = z.object({
      id:z.string().uuid()
    })
    const {id} =getTransactionsParamsSchema.parse(request.params)
    const {sessionId} = request.cookies
    const transaction = await knex('transactions').where({id:id,session_id:sessionId}).first()

    return {transaction}
  })

 app.post('/', async(request,reply) => {
      // {title,amount,type: credit or debit}
        
        const createTranscationBodySchema = z.object({
          title:z.string(),
          amount:z.number(),
          type:z.enum(['credit','debit'])
        })

        const {title,amount,type}= createTranscationBodySchema.parse(request.body)
        
        let sessionId = request.cookies.sessionId

        if(!sessionId){
          sessionId = randomUUID()

          reply.cookie('sessionId',sessionId,{
            path: '/',
            maxAge : 1000 * 60 * 60 * 24 * 7 // 7 days
          })
        }

        await knex('transactions').insert({
          id:randomUUID(),
          title,
          amount: type === 'credit' ? amount: amount * -1,
          session_id : sessionId
        })
        return reply.status(201).send()
        // 201 HTTP CODE - created with success
       
      })
}