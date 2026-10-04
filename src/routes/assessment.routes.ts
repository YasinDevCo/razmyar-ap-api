import { Router } from 'express'
import { assessmentController } from '../controllers/assessment.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth, requireRole } from '../middlewares/auth.middleware'
import { createAssessmentSchema } from '../validations/assessment.schema'

const router = Router()

// All assessment endpoints require valid authentication
router.use(requireAuth)

router.get('/', (req, res, next) => assessmentController.getAll(req, res, next))
router.get('/:id', (req, res, next) => assessmentController.getById(req, res, next))
router.post(
  '/',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(createAssessmentSchema),
  (req, res, next) => assessmentController.create(req, res, next)
)

export default router
