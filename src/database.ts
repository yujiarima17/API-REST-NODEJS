import {knex as setupKnex,Knex} from 'knex'
import 'dotenv/config'
if(!process.env.DATABASE_URL){
    throw new Error('Database Not Found!')
}
export const config : Knex.Config = {
    client:'sqlite',
    connection:{
        filename: process.env.DATABASE_URL
    },
migrations:{
    extension:'ts',
    directory:'./db/migrations'
},
    useNullAsDefault:true,
}
export const knex = setupKnex(config)