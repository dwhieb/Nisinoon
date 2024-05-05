import path from 'node:path'

const oneWeek         = 604800
const staticFilesPath = path.join(import.meta.dirname, `../assets`)

const options = { maxAge: oneWeek }

export default function serveStatic(express) {
  return express.static(staticFilesPath, options)
}
