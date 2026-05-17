import cron from 'node-cron'
import { cleanupOldData, cleanupOldPayloads } from './cleanupOldData.job.js'

export function startCleanupScheduler() {
    cron.schedule('0 3 * * *', async () => {
        try {
            await cleanupOldPayloads()
            await cleanupOldData()
            console.log('Cleanup complated')
        } catch (error) {
            console.error('Cleanup failed:', error)
        }
    })
}