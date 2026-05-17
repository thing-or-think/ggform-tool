import app from './app.js'
import { startCleanupScheduler } from './infrastructure/cleanup/cleanupScheduler.js'
import { env } from './config/index.js'
import { logger } from './logger/logger.js'

app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.port}`)
    startCleanupScheduler()
})