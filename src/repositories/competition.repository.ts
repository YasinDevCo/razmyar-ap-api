import { prisma } from '../config/database'
import { Prisma } from '@prisma/client'

export class CompetitionRepository {
  async findAll(where?: Prisma.CompetitionWhereInput) {
    return prisma.competition.findMany({
      where,
      include: {
        categories: true,
        participants: true,
        matches: {
          orderBy: [{ roundIndex: 'asc' }, { matchNumber: 'asc' }],
        },
        medals: {
          orderBy: { rank: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return prisma.competition.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            participants: true,
          },
        },
        participants: {
          include: {
            student: true,
            category: true,
          },
        },
        matches: {
          orderBy: [{ roundIndex: 'asc' }, { matchNumber: 'asc' }],
        },
        medals: {
          orderBy: { rank: 'asc' },
        },
      },
    })
  }

  async create(data: Prisma.CompetitionCreateInput) {
    return prisma.competition.create({
      data,
      include: {
        categories: true,
      },
    })
  }

  async update(id: string, data: Prisma.CompetitionUpdateInput) {
    return prisma.competition.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.competition.delete({
      where: { id },
    })
  }

  async addParticipant(data: Prisma.CompetitionParticipantCreateInput) {
    return prisma.competitionParticipant.create({
      data,
    })
  }

  async updateMatch(matchId: string, data: Prisma.MatchUpdateInput) {
    return prisma.match.update({
      where: { id: matchId },
      data,
    })
  }

  async findMatch(matchId: string) {
    return prisma.match.findUnique({
      where: { id: matchId },
    })
  }

  async setMedals(competitionId: string, medals: Prisma.MedalWinnerCreateManyInput[]) {
    await prisma.medalWinner.deleteMany({
      where: { competitionId },
    })
    return prisma.medalWinner.createMany({
      data: medals,
    })
  }
}

export const competitionRepository = new CompetitionRepository()
