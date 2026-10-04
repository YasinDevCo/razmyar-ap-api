import { prisma } from '../config/database'
import { Prisma } from '@prisma/client'

export class StudentRepository {
  async findAll(where?: Prisma.StudentWhereInput) {
    return prisma.student.findMany({
      where,
      include: {
        skills: true,
      },
      orderBy: { id: 'asc' },
    })
  }

  async findById(id: string) {
    return prisma.student.findFirst({
      where: {
        OR: [{ id }, { studentNumber: id }],
      },
      include: {
        skills: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
        },
        promotions: {
          orderBy: { createdAt: 'desc' },
        },
        attendanceLogs: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        participations: {
          include: {
            competition: true,
            category: true,
          },
        },
        medals: {
          include: {
            competition: true,
          },
        },
      },
    })
  }

  async create(data: Prisma.StudentCreateInput) {
    return prisma.student.create({ data })
  }

  async update(id: string, data: Prisma.StudentUpdateInput) {
    return prisma.student.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.student.delete({
      where: { id },
    })
  }

  async createNote(studentId: string, title: string, content: string, category = 'فنی و مبارزه', author = 'مربی امینی') {
    return prisma.studentNote.create({
      data: {
        studentId,
        title,
        content,
        category,
        author,
      },
    })
  }

  async createAttendance(studentId: string, title: string, dateText: string, timeText = '۱۶:۰۰', status = 'حاضر', note?: string) {
    return prisma.attendanceRecord.create({
      data: {
        studentId,
        title,
        dateText,
        timeText,
        status,
        note,
      },
    })
  }
}

export const studentRepository = new StudentRepository()
