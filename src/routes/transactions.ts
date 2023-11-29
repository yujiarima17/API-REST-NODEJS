import { FastifyInstance } from "fastify"

import { knex } from '../database'

import crypto from 'node:crypto'

import { z} from 'zod'

// Cookies <--> Formas de manter contexto entre requisições feitas pelo lado do cliente
export async function transactionsRoutes (app : FastifyInstance){

  app.get('/summary',async ()=>{
    const summary = await knex('transactions').sum('amount',{as:'amount'}).first()
    return {summary}
  })

  app.get('/',async()=>{
    const transactions = await knex('transactions').select()
    return {transactions}
  })

  app.get('/:id',async (request)=>{
    const getTransactionsParamsSchema = z.object({
      id:z.string().uuid()
    })
    const {id} =getTransactionsParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id',id).first()

    return transaction
  })

  app.post('/', async(request,reply) => {
      // {title,amount,type: credit or debit}
        
        const createTranscationBodySchema = z.object({
          title:z.string(),
          amount:z.number(),
          type:z.enum(['credit','debit'])
        })

        const {title,amount,type}= createTranscationBodySchema.parse(request.body)

        await knex('transactions').insert({
          id:crypto.randomUUID(),
          title,
          amount: type === 'credit' ? amount: amount * -1
        })
        return reply.status(201).send()
        // 201 HTTP CODE - created with success
       
      })
}