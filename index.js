// NB: Azure doesn't yet support Node v20.12, which introduces process.loadEnvFile.
// Use dotenv for now instead.
import 'dotenv/config'
import * as handlers           from './app/handlers.js'
import express                 from 'express'
import handleUncaughtException from './app/errors.js'
import helmet                  from 'helmet'
import logger                  from './middleware/logger.js'
import vary                    from './middleware/vary.js'

// Handle uncaught errors
process.on(`uncaughtException`, handleUncaughtException)

// Initialize Express app
const app = express()

// Settings
app.enable(`trust proxy`)
app.set(`env`, process.env.NODE_ENV)

// Middleware
app.use(helmet())
app.use(vary)
app.use(logger)

// Routes
app.get(`/`, handlers.OK)
app.use(handlers.PageNotFound)
app.use(handlers.ServerError)

// Start server
app.listen(process.env.PORT, () => {
  console.info(`\nServer started. Press Ctrl+C to terminate.
  ENV:  ${ process.env.NODE_ENV }
  PORT: ${ process.env.PORT }\n`)
})
