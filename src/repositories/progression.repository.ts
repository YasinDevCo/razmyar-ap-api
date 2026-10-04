import { prisma } from '../config/database'
import { Prisma } from '@prisma/client'

export class ProgressionRepository {
  async findBeltsByDiscipline(discipline = 'taekwondo') {
    return prisma.beltConfig.findMany({
      where: { discipline },
      orderBy: { order: 'asc' },
    })
  }

  async updateBelt(id: string, data: Prisma.BeltConfigUpdateInput) {
    return prisma.beltConfig.update({
      where: { id },
      data,
    })
  }

  async createBelt(data: Prisma.BeltConfigCreateInput) {
    return prisma.beltConfig.create({ data })
  }

  async deleteBelt(id: string) {
    return prisma.beltConfig.delete({ where: { id } })
  }
}

export const progressionRepository = new ProgressionRepository()
