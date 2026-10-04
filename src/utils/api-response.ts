import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: any
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse['meta']
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  })
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  error?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  })
}
