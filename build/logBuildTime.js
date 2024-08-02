import path from 'node:path'
import { readJSON, writeJSON } from 'fs-extra/esm'

export default async function logBuildTime() {
  const buildTime = (new Date).toISOString()
  const metaPath  = path.resolve(import.meta.dirname, `../meta.json`)
  const meta      = await readJSON(metaPath)

  meta.buildTime = buildTime

  await writeJSON(metaPath, meta, { spaces: 2 })

}
