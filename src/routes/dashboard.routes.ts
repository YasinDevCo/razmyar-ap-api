import { Router } from 'express'
import { dashboardController } from '../controllers/dashboard.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.use(requireAuth)

router.get('/stats', (req, res, next) => dashboardController.getStats(req, res, next))

export default router
