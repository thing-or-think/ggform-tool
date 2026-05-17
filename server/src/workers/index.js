import '../infrastructure/queue/submit.worker.js'
import { setupGracefulShutdown } from '../shared/shutdown.js'

setupGracefulShutdown()

console.log('Worker process started')