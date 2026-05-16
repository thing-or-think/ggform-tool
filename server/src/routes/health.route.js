import { Router } from 'express'
import { prisma } from '../infrastructure/database/prisma.js'

const router = Router()

router.get('/', async (req, res) => {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
    })
})

export default router