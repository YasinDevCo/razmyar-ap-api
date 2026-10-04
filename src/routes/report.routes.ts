import { Router } from 'express'
import { reportController } from '../controllers/report.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.use(requireAuth)

router.get('/kpis', (req, res, next) => reportController.getKPIs(req, res, next))
router.get('/downloads', (req, res, next) => reportController.getDownloads(req, res, next))

export default router
