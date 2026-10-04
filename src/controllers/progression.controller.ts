import { Request, Response, NextFunction } from 'express'
import { progressionService } from '../services/progression.service'
import { sendSuccess } from '../utils/api-response'

export class ProgressionController {
  async getBelts(req: Request, res: Response, next: NextFunction) {
    try {
      const discipline = (req.query.discipline as string) || 'taekwondo'
      const belts = await progressionService.getBelts(discipline)
      return sendSuccess(res, belts)
    } catch (error) {
      return next(error)
    }
  }

  async updateBelts(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await progressionService.updateBelts(req.body.belts)
      return sendSuccess(res, updated, 'تنظیمات کمربندها با موفقیت به‌روزرسانی شد')
    } catch (error) {
      return next(error)
    }
  }

  async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await progressionService.getProgressionStudents()
      return sendSuccess(res, students)
    } catch (error) {
      return next(error)
    }
  }
}

export const progressionController = new ProgressionController()
