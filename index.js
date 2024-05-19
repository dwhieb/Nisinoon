// NB: Azure doesn't yet support Node v20.12, which introduces process.loadEnvFile.
// Use dotenv for now instead.
import 'dotenv/config'
import * as handlers           from './pages/index.js'
import express                 from 'express'
import handleUncaughtException from './app/errors.js'
import hbs                     from './app/handlebars.js'
import helmet                  from './middleware/helmet.js'
import issueLink               from './middleware/issue-link.js'
import locals                  from './app/locals.js'
import logger                  from './middleware/logger.js'
import path                    from 'node:path'
import serveStatic             from './middleware/static.js'
import vary                    from './middleware/vary.js'

// Handle uncaught errors
process.on(`uncaughtException`, handleUncaughtException)

// Initialize Express app
const app = express()

Object.assign(app.locals, locals)

// Settings
app.enable(`trust proxy`)
app.engine(`hbs`, hbs.engine)
app.set(`env`, process.env.NODE_ENV)
app.set(`view engine`, `hbs`)
app.set(`views`, path.resolve(import.meta.dirname, `./pages`))

// Middleware
app.use(helmet)
app.use(vary)
app.use(serveStatic(express))
app.use(logger)
app.use(issueLink)

// Routes
app.get(`/`, handlers.About)
if (process.env.NODE_ENV !== `production`) {
  app.get(`/500-test`, handlers.ServerErrorTest)
}
app.get(`/bibliography`, handlers.Bibliography)
app.get(`/grammar`, handlers.Grammar)
app.get(`/research`, handlers.Research)
app.get(`/search`, handlers.Search)
app.use(handlers.PageNotFound)
app.use(handlers.ServerError)

// Start server
app.listen(process.env.PORT, () => {
  console.info(`\nServer started. Press Ctrl+C to terminate.
  ENV:  ${ process.env.NODE_ENV }
  PORT: ${ process.env.PORT }\n`)
})
