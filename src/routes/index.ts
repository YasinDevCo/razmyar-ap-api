import { Router } from 'express'
import authRoutes from './auth.routes'
import studentRoutes from './student.routes'
import assessmentRoutes from './assessment.routes'
import progressionRoutes from './progression.routes'
import competitionRoutes from './competition.routes'
import dashboardRoutes from './dashboard.routes'
import reportRoutes from './report.routes'
import settingsRoutes from './settings.routes'
import clubRoutes from './club.routes'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Razmyar API Service',
  })
})

router.use('/auth', authRoutes)
router.use('/clubs', clubRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/students', studentRoutes)
router.use('/assessments', assessmentRoutes)
router.use('/progression', progressionRoutes)
router.use('/competitions', competitionRoutes)
router.use('/reports', reportRoutes)
router.use('/settings', settingsRoutes)

export default router
