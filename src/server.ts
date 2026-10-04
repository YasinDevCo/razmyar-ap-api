import { createApp } from './app'
import { config } from './config/env'

const app = createApp()

app.listen(config.port, () => {
  console.log(`🥋 Razmyar Server is running on port ${config.port}`)
  console.log(`📍 Health check: http://localhost:${config.port}/api/health`)
})
