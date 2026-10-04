import { Request, Response, NextFunction } from 'express'
import { assessmentService } from '../services/assessment.service'
import { sendSuccess } from '../utils/api-response'

export class AssessmentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, belt, type, status } = req.query
      const assessments = await assessmentService.getAllAssessments(
        q as string,
        belt as string,
        type as string,
        status as string
      )
      return sendSuccess(res, assessments)
    } catch (error) {
      return next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const assessment = await assessmentService.getAssessmentById(id)
      return sendSuccess(res, assessment)
    } catch (error) {
      return next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await assessmentService.createAssessment(req.body)
      return sendSuccess(res, created, 'ارزیابی مهارتی با موفقیت ذخیره شد', 201)
    } catch (error) {
      return next(error)
    }
  }
}

export const assessmentController = new AssessmentController()
