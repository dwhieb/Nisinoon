import * as handlers           from './app/handlers.js'
import express                 from 'express'
import handleUncaughtException from './app/errors.js'
import { loadEnvFile }         from 'node:process'

// Handle uncaught errors
process.on(`uncaughtException`, handleUncaughtException)

// Load environment variables
if (!process.env.NODE_ENV) loadEnvFile()

// Initialize Express app
const app = express()

// Settings
app.enable(`trust proxy`)
app.set(`env`, process.env.NODE_ENV)

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
