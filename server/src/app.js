import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pinoHttp from 'pino-http'

import { env } from './config/index.js'
import { logger } from './logger/logger.js'
import healthRoute from './routes/health.route.js'

const app = express()

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true
    })
)

app.use(helmet())
app.use(express.json())
app.use(pinoHttp({ logger }))

app.use('/api/health', healthRoute)

export default app