import { z } from 'zod'

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'نام شاگرد الزامی است'),
    age: z.coerce.number().min(4).max(80).default(15),
    belt: z.string().default('سفید'),
    targetBelt: z.string().optional(),
    className: z.string().default('کلاس نوجوانان'),
    mobile: z.string().optional(),
    parentName: z.string().optional(),
    parentMobile: z.string().optional(),
    joinedAt: z.string().optional(),
    experience: z.string().optional(),
    avatar: z.string().optional(),
    avatarColor: z.string().optional(),
    color: z.string().optional(),
  }),
})

export const updateStudentSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.coerce.number().min(4).max(80).optional(),
    belt: z.string().optional(),
    targetBelt: z.string().optional(),
    className: z.string().optional(),
    mobile: z.string().optional(),
    parentName: z.string().optional(),
    parentMobile: z.string().optional(),
    status: z.string().optional(),
    attendanceRate: z.number().optional(),
    overallScore: z.number().optional(),
  }),
})

export const createStudentNoteSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().optional().default('یادداشت مربی'),
    content: z.string().min(2, 'متن یادداشت الزامی است'),
    category: z.string().optional().default('فنی و مبارزه'),
    author: z.string().optional().default('مربی امینی'),
  }),
})

export const createAttendanceSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().default('تمرین کلاسی'),
    dateText: z.string().optional(),
    timeText: z.string().optional().default('۱۶:۰۰'),
    status: z.enum(['حاضر', 'تاخیر', 'غیبت موجه', 'غیبت غیرموجه']).default('حاضر'),
    note: z.string().optional(),
  }),
})
