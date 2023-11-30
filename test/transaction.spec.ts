import {beforeAll, afterAll,it,expect} from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { describe } from 'node:test'

describe('Transactions routes',()=>{

    beforeAll(async ()=>{
    await app.ready()
    })

    afterAll(async ()=>{
      await app.close()
    })

    it('should be able to create a new transaction',async ()=>{
      await request(app.server).post('/transactions').send({
        title:'New Transaction',
        amount:5000,
        type:'credit'
      }).expect(201)
    })

    it('should be able to list all transaction',async ()=>{
      const createTransactionResponse =await request(app.server).post('/transactions').send({
        title:'New Transaction',
        amount:5000,
        type:'credit'
      }).expect(201)
      const cookies = createTransactionResponse.get('Set-Cookie')
      // await request(app.server).get('/transactions').set('Cokkie',cookies)]
      const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie',cookies).expect(200)
      expect(listTransactionsResponse.body.transactions).toEqual([
       expect.objectContaining({
        title:'New Transaction',
        amount:5000
       })
      ])
    })
})
