import { competitionRepository } from '../repositories/competition.repository'
import { studentRepository } from '../repositories/student.repository'

export class CompetitionService {
  private formatMatch(m: any) {
    let p1 = null
    let p2 = null
    try {
      if (typeof m.participant1 === 'string') p1 = JSON.parse(m.participant1)
      else p1 = m.participant1
    } catch {}
    try {
      if (typeof m.participant2 === 'string') p2 = JSON.parse(m.participant2)
      else p2 = m.participant2
    } catch {}

    return {
      ...m,
      participant1: p1,
      participant2: p2,
    }
  }

  private formatCompetition(c: any) {
    if (!c) return null
    return {
      ...c,
      matches: Array.isArray(c.matches) ? c.matches.map((m: any) => this.formatMatch(m)) : [],
    }
  }

  async getAllCompetitions() {
    const competitions = await competitionRepository.findAll()
    return competitions.map((c) => this.formatCompetition(c))
  }

  async getCompetitionById(id: string) {
    const comp = await competitionRepository.findById(id)
    if (!comp) {
      throw new Error('مسابقه یافت نشد')
    }
    return this.formatCompetition(comp)
  }

  async createCompetition(data: {
    title: string
    dateText?: string
    location?: string
    description?: string
    type?: string
    categories?: Array<{
      title: string
      ageGroup: string
      gender: string
      weight: string
    }>
  }) {
    const newId = `comp-${Date.now()}`
    const cats = data.categories || [
      {
        title: 'نوجوانان پسر - ۴۵ تا ۵۵ کیلو',
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        weight: '۴۵ تا ۵۵ کیلو',
      },
    ]

    return competitionRepository.create({
      id: newId,
      title: data.title,
      dateText: data.dateText || '۲۵ شهریور ۱۴۰۵',
      location: data.location || 'تهران، سالن ورزشی آزادی',
      description: data.description || 'مسابقات قهرمانی تکواندو باشگاه رزمیار.',
      type: data.type || 'درون باشگاهی',
      status: 'ثبت‌نام در حال انجام',
      participantsCount: 0,
      categories: {
        create: cats.map((c, i) => ({
          id: `cat-${newId}-${i + 1}`,
          title: c.title,
          ageGroup: c.ageGroup,
          gender: c.gender,
          weight: c.weight,
          participantsCount: 0,
        })),
      },
    })
  }

  async addParticipant(competitionId: string, data: { studentId: string; categoryId?: string; weight?: number; status?: string }) {
    const student = await studentRepository.findById(data.studentId)
    if (!student) throw new Error('شاگرد یافت نشد')

    const participantId = `cp-${Date.now()}`
    const part = await competitionRepository.addParticipant({
      id: participantId,
      competition: { connect: { id: competitionId } },
      student: { connect: { id: student.id } },
      ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
      name: student.name,
      age: student.age,
      belt: student.belt,
      weight: data.weight || 50,
      ageGroup: student.age < 14 ? 'نونهالان' : student.age < 18 ? 'نوجوانان' : 'جوانان',
      gender: 'مردان',
      status: data.status || 'تأیید شده',
      avatar: student.avatar,
    })

    // Increment participants count
    await competitionRepository.update(competitionId, {
      participantsCount: { increment: 1 },
    })

    return part
  }

  async updateMatchResult(
    competitionId: string,
    matchId: string,
    data: {
      score1: number
      score2: number
      winnerId?: string | null
      status?: string
      timeText?: string
    }
  ) {
    const match = await competitionRepository.findMatch(matchId)
    if (!match) throw new Error('بازی یافت نشد')

    let p1: any = null
    let p2: any = null
    try {
      if (typeof match.participant1 === 'string') p1 = JSON.parse(match.participant1)
      else p1 = match.participant1
    } catch {}

    try {
      if (typeof match.participant2 === 'string') p2 = JSON.parse(match.participant2)
      else p2 = match.participant2
    } catch {}

    let winnerId = data.winnerId
    if (!winnerId && p1 && p2) {
      if (data.score1 > data.score2) winnerId = p1.studentId
      else if (data.score2 > data.score1) winnerId = p2.studentId
    }

    const winnerObj = winnerId === p1?.studentId ? p1 : winnerId === p2?.studentId ? p2 : null

    const updatedP1 = p1 ? { ...p1, score: data.score1, isWinner: winnerId === p1.studentId } : null
    const updatedP2 = p2 ? { ...p2, score: data.score2, isWinner: winnerId === p2.studentId } : null

    const updated = await competitionRepository.updateMatch(matchId, {
      score1: data.score1,
      score2: data.score2,
      winnerId,
      status: data.status || 'پایان یافته',
      timeText: data.timeText || 'پایان بازی',
      participant1: updatedP1 ? JSON.stringify(updatedP1) : null,
      participant2: updatedP2 ? JSON.stringify(updatedP2) : null,
    })

    // Advance to next match if specified
    if (match.nextMatchId && winnerObj) {
      const nextMatch = await competitionRepository.findMatch(match.nextMatchId)
      if (nextMatch) {
        const slot = match.nextMatchSlot || 1
        const nextParticipant = {
          id: `p-${winnerObj.studentId}`,
          studentId: winnerObj.studentId,
          name: winnerObj.name,
          belt: winnerObj.belt,
          avatar: winnerObj.avatar,
          score: 0,
        }

        const serializedNext = JSON.stringify(nextParticipant)
        await competitionRepository.updateMatch(match.nextMatchId, {
          ...(slot === 1 ? { participant1: serializedNext } : { participant2: serializedNext }),
        })
      }
    }

    return this.formatMatch(updated)
  }
}

export const competitionService = new CompetitionService()
