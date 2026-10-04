import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { userRepository } from '../repositories/user.repository'
import { comparePassword } from '../utils/password'
import { prisma } from '../config/database'

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new Error('نام کاربری یا رمز عبور اشتباه است')
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      throw new Error('نام کاربری یا رمز عبور اشتباه است')
    }

    // For SUPER_ADMIN, fetch all clubs across all teams for platform management
    let availableClubs = user.team?.clubs || []
    if (user.role === 'SUPER_ADMIN') {
      availableClubs = await prisma.club.findMany({
        include: { team: true },
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn || '10m' } as any
    )

    const expiresInSeconds = 10 * 60 // 600 seconds (10 minutes)
    const expiresAt = Date.now() + expiresInSeconds * 1000

    return {
      token,
      expiresIn: expiresInSeconds,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        team: user.team,
        availableClubs,
      },
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new Error('کاربر یافت نشد')
    }
    const { password, ...safeUser } = user

    let availableClubs = user.team?.clubs || []
    if (user.role === 'SUPER_ADMIN') {
      availableClubs = await prisma.club.findMany({
        include: { team: true },
      })
    }

    return {
      ...safeUser,
      availableClubs,
    }
  }
}

export const authService = new AuthService()
