import { Router } from 'express'
import { settingsController } from '../controllers/settings.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth, requireRole } from '../middlewares/auth.middleware'
import { updateSettingsSchema } from '../validations/settings.schema'

const router = Router()

// Settings require authentication and coach/admin role
router.use(requireAuth)
router.use(requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']))

router.get('/', (req, res, next) => settingsController.get(req, res, next))
router.put('/', validate(updateSettingsSchema), (req, res, next) => settingsController.update(req, res, next))

export default router
