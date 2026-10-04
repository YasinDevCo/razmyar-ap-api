import { prisma } from '../config/database'
import { Prisma } from '@prisma/client'

export class UserRepository {
  async findByEmail(identifier: string) {
    const clean = identifier.trim().toLowerCase()
    
    // First try exact match
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: clean },
          { email: identifier.trim() },
        ],
      },
      include: {
        team: {
          include: {
            clubs: true,
          },
        },
      },
    })

    // If not found, check common alias (e.g. 'owner' -> 'owner@razmyar.ir', 'teamx' -> 'teamx@razmyar.ir')
    if (!user && !clean.includes('@')) {
      user = await prisma.user.findFirst({
        where: {
          email: `${clean}@razmyar.ir`,
        },
        include: {
          team: {
            include: {
              clubs: true,
            },
          },
        },
      })
    }

    return user
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            clubs: true,
          },
        },
      },
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }
}

export const userRepository = new UserRepository()
