import path         from 'node:path'
import { readJSON } from 'fs-extra/esm'

import { readdir, readFile } from 'node:fs/promises'

// Add metadata
const metaPath = path.resolve(import.meta.dirname, `../meta.json`)
const meta     = await readJSON(metaPath)

// Add package information
const packagePath = path.resolve(import.meta.dirname, `../package.json`)
const packageInfo = await readJSON(packagePath)

// Add CSS
const cssDir   = path.resolve(import.meta.dirname, `../assets/styles`)
const cssFiles = await readdir(cssDir)
const styles   = {}

for (const file of cssFiles) {
  const name     = path.basename(file, `.css`)
  const filePath = path.join(cssDir, file)
  styles[name]   = await readFile(filePath, `utf8`)
}

// Add JS for app shell
const mainJSPath = path.resolve(import.meta.dirname, `../assets/scripts/main.js`)
const mainJS     = await readFile(mainJSPath, `utf8`)

// Add other constants
const year = (new Date).getFullYear()

export default {
  mainJS,
  meta,
  'package': packageInfo,
  styles,
  year,
}
