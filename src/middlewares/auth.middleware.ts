import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: 'SUPER_ADMIN' | 'TEAM_ADMIN' | 'USER'
  teamId?: string | null
  clubId?: string | null
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

/**
 * Require valid JWT authentication via Cookie or Authorization header.
 * Enforces 10-minute token expiration and clears invalid/expired cookies.
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // 1. Try reading token from Authorization header or cookie
  let token: string | undefined

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.cookies && req.cookies.razmyar_token) {
    token = req.cookies.razmyar_token
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'احراز هویت انجام نشده است. لطفاً وارد حساب خود شوید.',
    })
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthUser
    req.user = payload
    return next()
  } catch (err: any) {
    // Clear expired or corrupted cookie immediately
    res.clearCookie('razmyar_token', { path: '/' })

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'نشست کاربری شما پس از ۱۰ دقیقه منقضی شد. لطفاً مجدداً وارد حساب خود شوید.',
      })
    }

    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'توکن امنیتی نامعتبر است. لطفاً مجدداً وارد شوید.',
    })
  }
}

/**
 * Enforces Role-Based Access Control (RBAC) permissions.
 * Allowed roles: SUPER_ADMIN, TEAM_ADMIN, USER
 */
export function requireRole(allowedRoles: ('SUPER_ADMIN' | 'TEAM_ADMIN' | 'USER')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'لطفاً ابتدا وارد حساب خود شوید.',
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'شما دسترسی مجاز برای انجام این عملیات یا مشاهده این بخش را ندارید.',
      })
    }

    return next()
  }
}

// Backward-compatible alias
export const authenticate = requireAuth
