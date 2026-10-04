import dotenv from 'dotenv'

dotenv.config()

const nodeEnv = process.env.NODE_ENV || 'development'
const jwtSecret = process.env.JWT_SECRET || 'razmyar_jwt_super_secret_key_2026'

if (nodeEnv === 'production' && jwtSecret === 'razmyar_jwt_super_secret_key_2026') {
  console.warn(
    '⚠️ [SECURITY WARNING]: JWT_SECRET is using the default development key in production mode! Set a strong JWT_SECRET in your production .env.'
  )
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  databaseUrl:
    process.env.DATABASE_URL ||
    'sqlserver://localhost:1433;database=Razmyar;user=sa;password=YourPassword123;encrypt=false;trustServerCertificate=true',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '10m',
  cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE || '600000', 10), // 10 minutes (600,000 ms)
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000',
}
