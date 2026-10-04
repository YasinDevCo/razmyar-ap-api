import { studentRepository } from '../repositories/student.repository'
import { intelligenceService } from './intelligence.service'

export class StudentService {
  async getAllStudents(query?: string, belt?: string, status?: string, clubId?: string, teamId?: string) {
    const where: any = {}

    if (teamId) {
      where.teamId = teamId
    }

    if (clubId && clubId !== 'ALL' && clubId !== 'همه' && clubId !== 'null' && clubId !== 'undefined') {
      where.clubId = clubId
    }

    if (query && query.trim()) {
      where.OR = [
        { name: { contains: query.trim() } },
        { id: { contains: query.trim() } },
        { studentNumber: { contains: query.trim() } },
      ]
    }

    if (belt && belt !== 'همه') {
      where.belt = belt
    }

    if (status && status !== 'همه') {
      where.status = status
    }

    const students = await studentRepository.findAll(where)
    return students.map((s) => ({
      ...s,
      score: s.overallScore,
      attendance: s.attendanceRate,
    }))
  }

  async getStudentById(id: string) {
    const student = await studentRepository.findById(id)
    if (!student) {
      throw new Error('شاگرد یافت نشد')
    }
    return {
      ...student,
      score: student.overallScore,
      attendance: student.attendanceRate,
    }
  }

  async createStudent(data: {
    name: string
    age?: number
    belt?: string
    targetBelt?: string
    className?: string
    mobile?: string
    parentName?: string
    parentMobile?: string
    joinedAt?: string
    experience?: string
    avatar?: string
    avatarColor?: string
    color?: string
    teamId?: string
    clubId?: string
  }) {
    // Generate next sequential student number to avoid collisions
    const students = await studentRepository.findAll()
    const numericIds = students
      .map((s) => parseInt(s.studentNumber || s.id, 10))
      .filter((n) => !isNaN(n) && n >= 1000 && n < 100000)

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 1031
    const nextId = String(maxId + 1)

    const beltMap: Record<string, string> = {
      'سفید': 'زرد',
      'زرد': 'سبز',
      'سبز': 'آبی',
      'آبی': 'قرمز',
      'قرمز': 'مشکی',
      'مشکی': 'مشکی دان ۲',
    }

    const currentBelt = data.belt || 'سفید'
    const targetBelt = data.targetBelt || beltMap[currentBelt] || 'زرد'

    return studentRepository.create({
      id: nextId,
      studentNumber: nextId,
      name: data.name,
      age: data.age || 15,
      belt: currentBelt,
      targetBelt,
      className: data.className || 'کلاس نوجوانان',
      mobile: data.mobile || '۰۹۱۲۱۲۳۴۵۶۷',
      parentName: data.parentName,
      parentMobile: data.parentMobile,
      joinedAt: data.joinedAt || 'هم‌اکنون',
      experience: data.experience || 'جدیدالورود',
      avatar: data.avatar || data.name[0] || 'ش',
      avatarColor: data.avatarColor || 'from-cyan-500 to-blue-600',
      color: data.color || 'bg-primary',
      status: 'فعال',
      attendanceRate: 100,
      overallScore: 75,
      medalsCount: 0,
      competitionsCount: 0,
      ...(data.teamId && { team: { connect: { id: data.teamId } } }),
      ...(data.clubId && data.clubId !== 'ALL' && { club: { connect: { id: data.clubId } } }),
    })
  }

  async updateStudent(id: string, data: any) {
    return studentRepository.update(id, data)
  }

  async deleteStudent(id: string) {
    return studentRepository.delete(id)
  }

  async getStudentAnalysis(id: string) {
    const student = await this.getStudentById(id)
    return intelligenceService.generateInsights(student)
  }

  async addNote(studentId: string, title: string, content: string, category?: string, author?: string) {
    return studentRepository.createNote(studentId, title, content, category, author)
  }

  async addAttendance(studentId: string, title: string, dateText?: string, timeText?: string, status?: string, note?: string) {
    return studentRepository.createAttendance(studentId, title, dateText || 'امروز', timeText, status, note)
  }
}

export const studentService = new StudentService()
