import { Router } from 'express'
import { studentController } from '../controllers/student.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth, requireRole } from '../middlewares/auth.middleware'
import {
  createStudentSchema,
  updateStudentSchema,
  createStudentNoteSchema,
  createAttendanceSchema,
} from '../validations/student.schema'

const router = Router()

// All student routes require authentication
router.use(requireAuth)

// Read access (all authenticated roles can view according to their scope)
router.get('/', (req, res, next) => studentController.getAll(req, res, next))
router.get('/:id', (req, res, next) => studentController.getById(req, res, next))
router.get('/:id/analysis', (req, res, next) => studentController.getAnalysis(req, res, next))

// Management access: Only SUPER_ADMIN and TEAM_ADMIN can create, update, or delete students
router.post(
  '/',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(createStudentSchema),
  (req, res, next) => studentController.create(req, res, next)
)
router.put(
  '/:id',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(updateStudentSchema),
  (req, res, next) => studentController.update(req, res, next)
)
router.delete(
  '/:id',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  (req, res, next) => studentController.delete(req, res, next)
)

router.post(
  '/:id/notes',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(createStudentNoteSchema),
  (req, res, next) => studentController.addNote(req, res, next)
)
router.post(
  '/:id/attendance',
  requireRole(['SUPER_ADMIN', 'TEAM_ADMIN']),
  validate(createAttendanceSchema),
  (req, res, next) => studentController.addAttendance(req, res, next)
)

export default router
