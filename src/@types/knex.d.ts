// eslint-disable-next-line
import {Knex} from 'knex'

declare module 'knex/type/tables'{
    export interface Tables{
        trnasactions :{
            id:string
            title:string
            amount:number
            created_at : string
            session_id?:string
        }
    }
}