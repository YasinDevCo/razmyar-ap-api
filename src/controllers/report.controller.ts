import { Request, Response, NextFunction } from 'express'
import { reportService } from '../services/report.service'
import { sendSuccess } from '../utils/api-response'

export class ReportController {
  async getKPIs(req: Request, res: Response, next: NextFunction) {
    try {
      const kpis = await reportService.getReportKPIs()
      return sendSuccess(res, kpis)
    } catch (error) {
      return next(error)
    }
  }

  async getDownloads(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await reportService.getAvailableReports()
      return sendSuccess(res, reports)
    } catch (error) {
      return next(error)
    }
  }
}

export const reportController = new ReportController()
