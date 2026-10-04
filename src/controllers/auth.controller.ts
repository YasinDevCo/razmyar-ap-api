import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess } from '../utils/api-response'
import { AuthRequest } from '../middlewares/auth.middleware'
import { config } from '../config/env'

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)

      // Set cookie with 10-minute expiration (600,000 ms)
      const maxAgeMs = config.cookieMaxAge || 10 * 60 * 1000

      const isProd = config.nodeEnv === 'production'

      res.cookie('razmyar_token', result.token, {
        maxAge: maxAgeMs,
        httpOnly: false, // Accessible to Next.js middleware and client
        sameSite: 'lax',
        secure: isProd,
        path: '/',
      })

      res.cookie('razmyar_expires_at', result.expiresAt.toString(), {
        maxAge: maxAgeMs,
        httpOnly: false,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
      })

      return sendSuccess(res, result, 'ورود با موفقیت انجام شد')
    } catch (error) {
      return next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Clear all authentication cookies
      res.clearCookie('razmyar_token', { path: '/' })
      res.clearCookie('razmyar_expires_at', { path: '/' })
      return sendSuccess(res, { loggedOut: true }, 'خروج از حساب با موفقیت انجام شد')
    } catch (error) {
      return next(error)
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id)
      return sendSuccess(res, user)
    } catch (error) {
      return next(error)
    }
  }
}

export const authController = new AuthController()
