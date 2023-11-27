import 'dotenv/config'
import {z} from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string(),
    NODE_ENV:z.enum(['development','test','production']).default('production'),
    PORT:z.number().default(3333)


})
// validacao do objeto process.env
const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('WARNING : INVALID ENVIRONMENT VARIABLES',_env.error.format())
    throw new Error('Invalid environment variables.')
}
export const env = _env.data