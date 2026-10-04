import { prisma } from '../config/database'
import { Prisma } from '@prisma/client'

export class ClubRepository {
  async findFirst() {
    return prisma.club.findFirst()
  }

  async update(id: string, data: Prisma.ClubUpdateInput) {
    return prisma.club.update({
      where: { id },
      data,
    })
  }
}

export const clubRepository = new ClubRepository()
