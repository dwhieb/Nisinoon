import path         from 'node:path'
import { readFile } from 'node:fs/promises'

const metaPath = path.resolve(import.meta.dirname, `../package.json`)
const json     = await readFile(metaPath, `utf8`)
const meta     = JSON.parse(json)

export default { meta }
