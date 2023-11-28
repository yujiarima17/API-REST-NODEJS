import { FastifyInstance } from "fastify"
import { knex } from '../database'
import crypto from 'node:crypto'
import { z} from 'zod'
export async function transactionsRoutes (app : FastifyInstance){
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