import { Router } from 'express'
import { progressionController } from '../controllers/progression.controller'
import { requireAuth, requireRole } from '../middlewares/auth.middleware'

const router = Router()

router.use(requireAuth)

router.get('/belts', (req, res, next) => progressionController.getBelts(req, res, next))
router.put('/belts', requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']), (req, res, next) => progressionController.updateBelts(req, res, next))
router.get('/students', (req, res, next) => progressionController.getStudents(req, res, next))

export default router
