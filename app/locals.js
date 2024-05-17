import path         from 'node:path'
import { readFile } from 'node:fs/promises'

// Load metadata
const metaPath = path.resolve(import.meta.dirname, `../package.json`)
const json     = await readFile(metaPath, `utf8`)
const meta     = JSON.parse(json)

// Load CSS for app shell
const mainCSSPath = path.resolve(import.meta.dirname, `../assets/styles/main.css`)
const mainCSS     = await readFile(mainCSSPath, `utf8`)

export default { mainCSS, meta }
