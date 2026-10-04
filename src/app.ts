import express, { Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'
import { errorHandler } from './middlewares/error.middleware'
import { config } from './config/env'

export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')

  // Middlewares
  const configuredOrigins = config.corsOrigin
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  const isDev = config.nodeEnv !== 'production'

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) {
          return callback(null, true)
        }

        // Check if origin is explicitly allowed
        if (configuredOrigins.includes(origin)) {
          return callback(null, true)
        }

        // In development, allow localhost and 127.0.0.1 on any port
        if (isDev && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true)
        }

        // Reject all other origins in production
        return callback(new Error(`دامنه ${origin} دسترسی مجاز به API ندارد`))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-selected-club-id'],
      maxAge: 86400,
    })
  )
  app.use(cookieParser())
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true, limit: '2mb' }))

  // Mount API routes
  app.use('/api', routes)

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `مسیر درخواستی ${req.method} ${req.url} یافت نشد`,
    })
  })

  // Global Error Handler
  app.use(errorHandler)

  return app
}
