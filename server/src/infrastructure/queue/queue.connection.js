/**
 * Redis Queue Connection
 *
 * Responsibility:
 * - Creates the shared Redis connection used by BullMQ queue infrastructure.
 * - Centralizes Redis connection configuration from environment variables.
 *
 * Used by:
 * - BullMQ queues.
 * - BullMQ workers.
 * - Dead letter queue handlers.
 *
 * Notes:
 * - `maxRetriesPerRequest: null` is required for BullMQ worker compatibility.
 * - Keep this connection isolated from general cache usage if the application uses Redis for multiple purposes.
 */

import IORedis from 'ioredis'
import { env } from '../../config/env.js'

export const redisConnection = new IORedis({
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password,
    maxRetriesPerRequest: null,
})