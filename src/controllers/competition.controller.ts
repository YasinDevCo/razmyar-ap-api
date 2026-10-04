import { Request, Response, NextFunction } from 'express'
import { competitionService } from '../services/competition.service'
import { sendSuccess } from '../utils/api-response'

export class CompetitionController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const competitions = await competitionService.getAllCompetitions()
      return sendSuccess(res, competitions)
    } catch (error) {
      return next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const competition = await competitionService.getCompetitionById(id)
      return sendSuccess(res, competition)
    } catch (error) {
      return next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await competitionService.createCompetition(req.body)
      return sendSuccess(res, created, 'مسابقه جدید با موفقیت ایجاد شد', 201)
    } catch (error) {
      return next(error)
    }
  }

  async addParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const participant = await competitionService.addParticipant(id, req.body)
      return sendSuccess(res, participant, 'شرکت‌کننده با موفقیت به مسابقه اضافه شد', 201)
    } catch (error) {
      return next(error)
    }
  }

  async updateMatchResult(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId
      const updatedMatch = await competitionService.updateMatchResult(
        id,
        matchId,
        req.body
      )
      return sendSuccess(res, updatedMatch, 'نتیجه بازی با موفقیت ثبت شد')
    } catch (error) {
      return next(error)
    }
  }
}

export const competitionController = new CompetitionController()
