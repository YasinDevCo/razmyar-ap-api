import { Request, Response, NextFunction } from 'express'
import { studentService } from '../services/student.service'
import { sendSuccess } from '../utils/api-response'

export class StudentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, belt, status, clubId, teamId } = req.query
      const headerClubId = req.headers['x-selected-club-id'] as string | undefined
      const effectiveClubId = (clubId as string) || headerClubId
      const effectiveTeamId = (teamId as string) || (req as any).user?.teamId

      const students = await studentService.getAllStudents(
        q as string,
        belt as string,
        status as string,
        effectiveClubId,
        effectiveTeamId
      )
      return sendSuccess(res, students)
    } catch (error) {
      return next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const student = await studentService.getStudentById(id)
      return sendSuccess(res, student)
    } catch (error) {
      return next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user
      const headerClubId = req.headers['x-selected-club-id'] as string | undefined
      const created = await studentService.createStudent({
        ...req.body,
        teamId: req.body.teamId || user?.teamId || 'FAJR',
        clubId: req.body.clubId || (headerClubId !== 'ALL' ? headerClubId : undefined) || 'PARTO',
      })
      return sendSuccess(res, created, 'پرونده شاگرد با موفقیت ثبت شد', 201)
    } catch (error) {
      return next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const updated = await studentService.updateStudent(id, req.body)
      return sendSuccess(res, updated, 'اطلاعات شاگرد با موفقیت ویرایش شد')
    } catch (error) {
      return next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      await studentService.deleteStudent(id)
      return sendSuccess(res, null, 'پرونده شاگرد با موفقیت حذف شد')
    } catch (error) {
      return next(error)
    }
  }

  async getAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const analysis = await studentService.getStudentAnalysis(id)
      return sendSuccess(res, analysis)
    } catch (error) {
      return next(error)
    }
  }

  async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const { title, content, category, author } = req.body
      const note = await studentService.addNote(id, title, content, category, author)
      return sendSuccess(res, note, 'یادداشت با موفقیت ثبت شد', 201)
    } catch (error) {
      return next(error)
    }
  }

  async addAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const { title, dateText, timeText, status, note } = req.body
      const record = await studentService.addAttendance(id, title, dateText, timeText, status, note)
      return sendSuccess(res, record, 'گزارش حضور و غیاب ثبت شد', 201)
    } catch (error) {
      return next(error)
    }
  }
}

export const studentController = new StudentController()
