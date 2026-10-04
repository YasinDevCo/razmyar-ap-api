import { z } from 'zod'

export const updateSettingsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    coachName: z.string().optional(),
    phone: z.string().optional(),
    mainDiscipline: z.string().optional(),
    passingScore: z.coerce.number().min(50).max(100).optional(),
    evaluationPeriodDays: z.coerce.number().min(7).max(365).optional(),
  }),
})
