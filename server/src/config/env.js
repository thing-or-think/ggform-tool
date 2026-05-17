/**
 * Environment Configuration
 *
 * Responsibility:
 * - Loads and validates required environment variables at application startup.
 * - Provides a typed, centralized configuration object for app, database, Redis, and queue settings.
 *
 * Used by:
 * - Application bootstrap
 * - Database configuration
 * - Queue infrastructure
 * - Worker runtime
 *
 * Notes:
 * - The process exits early when required environment variables are invalid.
 * - All modules should read configuration from this file instead of accessing process.env directly.
 */

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

  REDIS_PASSWORD: z
    .string()
    .optional(),

  CLIENT_URL: z
    .string()
    .default('http://localhost:5173'),

  QUEUE_SUBMIT_NAME: z
    .string()
    .default('form-submit-queue'),

  QUEUE_SUBMIT_DLQ_NAME: z
    .string()
    .default('form-submit-dlq'),

  WORKER_CONCURRENCY: z
    .coerce
    .number()
    .default(5)
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('Invalid environment variables')
  console.error(parsedEnv.error.flatten().fieldErrors)
  process.exit(1)
}

const config = parsedEnv.data

export const env = {
  nodeEnv: config.NODE_ENV,
  port: config.PORT,
  databaseUrl: config.DATABASE_URL,

  redis: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD ?? undefined
  },

  queue: {
    submitQueueName: config.QUEUE_SUBMIT_NAME,
    submitDlqName: config.QUEUE_SUBMIT_DLQ_NAME,
    workerConcurrency: config.WORKER_CONCURRENCY
  },

  clientUrl: config.CLIENT_URL
}