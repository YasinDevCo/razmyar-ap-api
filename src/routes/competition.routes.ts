import { Router } from 'express'
import { competitionController } from '../controllers/competition.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth, requireRole } from '../middlewares/auth.middleware'
import {
  createCompetitionSchema,
  addParticipantSchema,
  updateMatchResultSchema,
} from '../validations/competition.schema'

const router = Router()

// All competition routes require authentication
router.use(requireAuth)

router.get('/', (req, res, next) => competitionController.getAll(req, res, next))
router.get('/:id', (req, res, next) => competitionController.getById(req, res, next))

router.post(
  '/',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(createCompetitionSchema),
  (req, res, next) => competitionController.create(req, res, next)
)
router.post(
  '/:id/participants',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(addParticipantSchema),
  (req, res, next) => competitionController.addParticipant(req, res, next)
)
router.put(
  '/:id/matches/:matchId',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(updateMatchResultSchema),
  (req, res, next) => competitionController.updateMatchResult(req, res, next)
)

export default router
