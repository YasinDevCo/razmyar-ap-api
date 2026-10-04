import { Request, Response, NextFunction } from 'express'
import { dashboardService } from '../services/dashboard.service'
import { sendSuccess } from '../utils/api-response'

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getDashboardStats()
      return sendSuccess(res, stats)
    } catch (error) {
      return next(error)
    }
  }
}

export const dashboardController = new DashboardController()
