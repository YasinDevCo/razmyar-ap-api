import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error('[API Error]:', err)

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'داده‌های ورودی نامعتبر است',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'خطای داخلی سرور رخ داده است'

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
