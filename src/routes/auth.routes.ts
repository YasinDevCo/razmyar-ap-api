import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { validate } from '../middlewares/validate.middleware'
import { loginSchema } from '../validations/auth.schema'
import { requireAuth } from '../middlewares/auth.middleware'

const router = Router()

router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next))
router.post('/logout', (req, res, next) => authController.logout(req, res, next))
router.get('/me', requireAuth, (req, res, next) => authController.getMe(req, res, next))

export default router
