import { z } from 'zod'

export const createCompetitionSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'عنوان مسابقه الزامی است'),
    dateText: z.string().optional().default('۲۵ شهریور ۱۴۰۵'),
    location: z.string().optional().default('تهران، سالن ورزشی'),
    description: z.string().optional().default('مسابقات قهرمانی رزمیار'),
    type: z.enum(['درون باشگاهی', 'بین باشگاهی', 'استانی']).default('درون باشگاهی'),
    categories: z
      .array(
        z.object({
          title: z.string(),
          ageGroup: z.string(),
          gender: z.string(),
          weight: z.string(),
        })
      )
      .optional(),
  }),
})

export const addParticipantSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    studentId: z.string(),
    categoryId: z.string().optional(),
    weight: z.number().default(50),
    status: z.enum(['تأیید شده', 'در انتظار وزن‌کشی', 'وزن‌کشی شده', 'انصراف']).default('تأیید شده'),
  }),
})

export const updateMatchResultSchema = z.object({
  params: z.object({
    id: z.string(),
    matchId: z.string(),
  }),
  body: z.object({
    score1: z.number().min(0),
    score2: z.number().min(0),
    winnerId: z.string().nullable().optional(),
    status: z.enum(['در انتظار', 'در حال برگزاری', 'پایان یافته']).default('پایان یافته'),
    timeText: z.string().optional(),
  }),
})
