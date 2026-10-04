import { z } from 'zod'

export const skillAssessmentItemSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  category: z.string(),
})

export const createAssessmentSchema = z.object({
  body: z.object({
    studentId: z.string(),
    type: z.string().default('ارزیابی کمربند'),
    belt: z.string().optional(),
    evaluator: z.string().optional().default('مربی امینی'),
    skills: z.array(skillAssessmentItemSchema),
    notes: z.string().optional(),
  }),
})
