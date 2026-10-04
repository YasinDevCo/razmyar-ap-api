import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'وارد کردن نام کاربری یا ایمیل الزامی است' })
      .min(3, 'نام کاربری یا ایمیل باید حداقل ۳ کاراکتر باشد')
      .max(100, 'نام کاربری یا ایمیل نباید بیشتر از ۱۰۰ کاراکتر باشد'),
    password: z
      .string({ required_error: 'وارد کردن رمز عبور الزامی است' })
      .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
      .max(100, 'رمز عبور نباید بیشتر از ۱۰۰ کاراکتر باشد'),
  }),
})

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
    email: z.string().email('فرمت ایمیل نامعتبر است'),
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    role: z.enum(['SUPER_ADMIN', 'TEAM_ADMIN', 'USER']).optional(),
    teamId: z.string().optional(),
    clubName: z.string().optional(),
  }),
})
