import { Router, Response } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/api-response'
import { requireAuth, requireRole, AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

// GET /api/clubs - List accessible clubs based on team
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    const teamIdQuery = req.query.teamId as string | undefined

    let whereClause: any = {}

    if (user && user.role === 'TEAM_ADMIN') {
      // Security: TEAM_ADMIN can ONLY see clubs belonging to their team!
      whereClause.teamId = user.teamId || 'FAJR'
    } else if (teamIdQuery) {
      whereClause.teamId = teamIdQuery
    } else {
      // Default to FAJR clubs for public/initial view
      whereClause.teamId = 'FAJR'
    }

    const clubs = await prisma.club.findMany({
      where: whereClause,
      include: {
        team: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return sendSuccess(res, clubs)
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/clubs/teams - List teams: strictly for SUPER_ADMIN only
router.get('/teams', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        clubs: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    })
    return sendSuccess(res, teams)
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

export default router
