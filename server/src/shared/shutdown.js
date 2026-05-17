/**
 * Graceful Shutdown Handler
 *
 * Responsibility:
 * - Handles process termination signals for the submission worker runtime.
 * - Safely closes BullMQ workers, queues, DLQ, and Redis connection.
 *
 * Used by:
 * - Worker bootstrap files
 * - Background job runtime
 * - Deployment/runtime process managers
 *
 * Notes:
 * - Prevents abrupt shutdown while jobs or queue resources are still active.
 * - Shutdown should be registered once during worker startup.
 */

import { submitWorker } from '../infrastructure/queue/submit.worker.js'
import { submitQueue } from '../infrastructure/queue/submit.queue.js'
import { submitDlq } from '../infrastructure/queue/submit.dlq.js'
import { redisConnection } from '../infrastructure/queue/queue.connection.js'

export function setupGracefulShutdown() {
    const shutdown = async (signal) => {
        console.log(`Received ${signal}. Closing worker...`)

        await submitWorker.close()
        await submitQueue.close()
        await submitDlq.close()
        await redisConnection.quit()

        console.log('Worker shutdown completed')
        process.exit(0)
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
}