import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z
    .coerce
    .number()
    .default(5000),

  DATABASE_URL: z
    .string()
    .min(1),

  REDIS_HOST: z
    .string()
    .default('localhost'),

  REDIS_PORT: z
    .coerce
    .number()
    .default(6379),

  CLIENT_URL: z
    .string()
    .default('http://localhost:5173')
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('Invalid environment variables')
  console.error(parsedEnv.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsedEnv.data