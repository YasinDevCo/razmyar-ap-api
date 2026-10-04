import { prisma } from '../config/database'
import { Prisma } from '@prisma/client'

export class AssessmentRepository {
  async findAll(where?: Prisma.AssessmentWhereInput) {
    return prisma.assessment.findMany({
      where,
      include: {
        student: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return prisma.assessment.findUnique({
      where: { id },
      include: {
        student: true,
      },
    })
  }

  async create(data: Prisma.AssessmentCreateInput) {
    return prisma.assessment.create({
      data,
      include: {
        student: true,
      },
    })
  }

  async delete(id: string) {
    return prisma.assessment.delete({
      where: { id },
    })
  }
}

export const assessmentRepository = new AssessmentRepository()
