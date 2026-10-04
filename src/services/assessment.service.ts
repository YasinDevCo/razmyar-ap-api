import { assessmentRepository } from '../repositories/assessment.repository'
import { studentRepository } from '../repositories/student.repository'
import { faNumber } from '../utils/persian-utils'

export class AssessmentService {
  async getAllAssessments(query?: string, belt?: string, type?: string, status?: string) {
    const where: any = {}

    if (belt && belt !== 'همه کمربندها') {
      where.belt = belt
    }

    if (type && type !== 'همه ارزیابیها') {
      where.type = { contains: type.replace('ارزیابی ', '') }
    }

    if (status && status !== 'همه وضعیتها') {
      where.status = status
    }

    const assessments = await assessmentRepository.findAll(where)

    const formatted = assessments.map((a) => this.formatAssessment(a))

    if (query && query.trim()) {
      const q = query.trim()
      return formatted.filter(
        (a) =>
          a.studentName.includes(q) ||
          a.studentClass.includes(q) ||
          a.evaluator.includes(q)
      )
    }

    return formatted
  }

  async getAssessmentById(id: string) {
    const assessment = await assessmentRepository.findById(id)
    if (!assessment) {
      throw new Error('ارزیابی یافت نشد')
    }
    return this.formatAssessment(assessment)
  }

  private formatAssessment(a: any) {
    let categoryScores: Record<string, number> = {
      'تکنیک‌ها': 0,
      'فرم': 0,
      'مبارزه': 0,
      'آمادگی جسمانی': 0,
    }
    let skills: any[] = []
    let recommendations: any = { focusSkills: [], text: '', strengths: [] }

    try {
      if (typeof a.categoryScores === 'string') {
        categoryScores = JSON.parse(a.categoryScores)
      } else if (a.categoryScores) {
        categoryScores = a.categoryScores
      }
    } catch {
      // Use defaults if corrupted
    }

    try {
      if (typeof a.skillsData === 'string') {
        skills = JSON.parse(a.skillsData)
      } else if (Array.isArray(a.skillsData)) {
        skills = a.skillsData
      }
    } catch {
      // Use defaults if corrupted
    }

    try {
      if (typeof a.recommendations === 'string') {
        recommendations = JSON.parse(a.recommendations)
      } else if (a.recommendations) {
        recommendations = a.recommendations
      }
    } catch {
      // Use defaults if corrupted
    }

    return {
      id: a.id,
      studentId: a.studentId,
      studentName: a.student?.name || '',
      studentAvatar: a.student?.avatar || 'ع',
      studentBelt: a.student?.belt || a.belt,
      targetBelt: a.student?.targetBelt || '',
      studentClass: a.student?.className || '',
      type: a.type,
      belt: a.belt,
      score: a.score,
      date: a.dateText,
      evaluator: a.evaluator,
      status: a.status,
      categoryScores,
      skills,
      notes: a.notes,
      beltReadiness: a.beltReadiness,
      recommendations,
      createdAt: a.createdAt,
    }
  }

  async createAssessment(data: {
    studentId: string
    type?: string
    belt?: string
    evaluator?: string
    skills: Array<{ name: string; score: number; category: string }>
    notes?: string
  }) {
    const student = await studentRepository.findById(data.studentId)
    if (!student) {
      throw new Error('شاگرد مورد نظر یافت نشد')
    }

    const skills = data.skills
    const categoryTotals: Record<string, { sum: number; count: number }> = {
      'تکنیک‌ها': { sum: 0, count: 0 },
      'فرم': { sum: 0, count: 0 },
      'مبارزه': { sum: 0, count: 0 },
      'آمادگی جسمانی': { sum: 0, count: 0 },
    }

    skills.forEach((s) => {
      if (categoryTotals[s.category]) {
        categoryTotals[s.category].sum += s.score
        categoryTotals[s.category].count += 1
      }
    })

    const categoryScores: Record<string, number> = {
      'تکنیک‌ها': categoryTotals['تکنیک‌ها'].count > 0 ? Math.round(categoryTotals['تکنیک‌ها'].sum / categoryTotals['تکنیک‌ها'].count) : 0,
      'فرم': categoryTotals['فرم'].count > 0 ? Math.round(categoryTotals['فرم'].sum / categoryTotals['فرم'].count) : 0,
      'مبارزه': categoryTotals['مبارزه'].count > 0 ? Math.round(categoryTotals['مبارزه'].sum / categoryTotals['مبارزه'].count) : 0,
      'آمادگی جسمانی': categoryTotals['آمادگی جسمانی'].count > 0 ? Math.round(categoryTotals['آمادگی جسمانی'].sum / categoryTotals['آمادگی جسمانی'].count) : 0,
    }

    const overallScore = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
      : 0

    const sortedAsc = [...skills].sort((a, b) => a.score - b.score)
    const sortedDesc = [...skills].sort((a, b) => b.score - a.score)

    let status = 'تکمیل شده'
    if (overallScore >= 85) {
      status = 'آماده ارتقا'
    } else if (overallScore < 70) {
      status = 'نیازمند توجه'
    }

    const beltReadiness = Math.min(100, Math.max(0, Math.round(overallScore * 1.02)))

    const recommendations = {
      focusSkills: sortedAsc.slice(0, 3).map((s) => s.name),
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: sortedDesc.slice(0, 3).map((s) => s.name),
    }

    const newId = `asm-${Date.now()}`
    const created = await assessmentRepository.create({
      id: newId,
      student: { connect: { id: student.id } },
      type: data.type || 'ارزیابی کمربند',
      belt: data.belt || student.belt,
      score: overallScore,
      dateText: `امروز، ${faNumber(new Date().getDate())} شهریور ۱۴۰۵`,
      evaluator: data.evaluator || 'مربی امینی',
      status,
      categoryScores: JSON.stringify(categoryScores),
      skillsData: JSON.stringify(skills),
      notes: data.notes || 'ارزیابی مهارتی با موفقیت انجام شد.',
      beltReadiness,
      recommendations: JSON.stringify(recommendations),
    })

    // Update student's overall score and status
    await studentRepository.update(student.id, {
      overallScore,
      status: overallScore >= 85 ? 'آماده ارتقا' : overallScore < 70 ? 'نیازمند تمرین' : 'فعال',
    })

    return this.formatAssessment(created)
  }
}

export const assessmentService = new AssessmentService()
