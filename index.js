import 'dotenv/config'
import express from 'express'

// Initialize app
const app = express()

// Settings
app.enable(`trust proxy`)
app.set(`env`, process.env.NODE_ENV)

// Routes
app.get(`/`, (req, res) => {
  res.send(`Nisinoon`)
})

// Start server
app.listen(process.env.PORT, () => {
  console.info(`\nServer started. Press Ctrl+C to terminate.
  ENV:  ${ process.env.NODE_ENV }
  PORT: ${ process.env.PORT }\n`)
})
