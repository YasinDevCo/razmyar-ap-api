import { progressionRepository } from '../repositories/progression.repository'
import { studentRepository } from '../repositories/student.repository'

export class ProgressionService {
  private formatBelt(b: any) {
    let categoryRequirements = []
    let skillRequirements = []

    try {
      if (typeof b.categoryRequirements === 'string') {
        categoryRequirements = JSON.parse(b.categoryRequirements)
      } else if (Array.isArray(b.categoryRequirements)) {
        categoryRequirements = b.categoryRequirements
      }
    } catch {}

    try {
      if (typeof b.skillRequirements === 'string') {
        skillRequirements = JSON.parse(b.skillRequirements)
      } else if (Array.isArray(b.skillRequirements)) {
        skillRequirements = b.skillRequirements
      }
    } catch {}

    return {
      ...b,
      categoryRequirements,
      skillRequirements,
    }
  }

  async getBelts(discipline = 'taekwondo') {
    const belts = await progressionRepository.findBeltsByDiscipline(discipline)
    return belts.map((b) => this.formatBelt(b))
  }

  async updateBelts(belts: Array<any>) {
    const results = []
    for (const b of belts) {
      if (b.id) {
        const catReqs =
          typeof b.categoryRequirements === 'object'
            ? JSON.stringify(b.categoryRequirements)
            : b.categoryRequirements || '[]'
        const skillReqs =
          typeof b.skillRequirements === 'object'
            ? JSON.stringify(b.skillRequirements)
            : b.skillRequirements || '[]'

        const updated = await progressionRepository.updateBelt(b.id, {
          name: b.name,
          order: b.order,
          color: b.color,
          bgColor: b.bgColor,
          textColor: b.textColor,
          borderColor: b.borderColor,
          dotColor: b.dotColor,
          minimumOverallScore: b.minimumOverallScore,
          categoryRequirements: catReqs,
          skillRequirements: skillReqs,
        })
        results.push(this.formatBelt(updated))
      }
    }
    return results
  }

  async getProgressionStudents() {
    const students = await studentRepository.findAll()
    return students.map((s) => ({
      studentId: s.id,
      name: s.name,
      avatar: s.avatar,
      avatarColor: s.avatarColor,
      currentBelt: s.belt,
      targetBelt: s.targetBelt || 'قرمز',
      className: s.className,
      age: s.age,
      readinessScore: s.overallScore,
      weakestCategory: 'مبارزه',
      lastAssessmentDate: '۱۲ شهریور ۱۴۰۵',
      weakSkills: [
        { name: 'دفاع', score: 64 },
        { name: 'جابه‌جایی پا', score: 61 },
        { name: 'حمله متقابل', score: 68 },
      ],
      studentCategoryScores: {
        'تکنیک‌ها': 88,
        'فرم': 79,
        'مبارزه': 72,
        'آمادگی جسمانی': 91,
      },
      studentSkillScores: {
        'آپ چاگی': 92,
        'دولیو چاگی': 88,
        'یوپ چاگی': 85,
        'دوی چاگی': 87,
      },
      promotionHistory: [],
    }))
  }
}

export const progressionService = new ProgressionService()
