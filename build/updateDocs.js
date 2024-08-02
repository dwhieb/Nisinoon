import path from 'node:path'
import yaml from 'yaml'

import { readFile, writeFile } from 'node:fs/promises'
import { readJSON, writeJSON } from 'fs-extra/esm'

const citationPath = path.resolve(import.meta.dirname, `../CITATION.cff`)
const licensePath  = path.resolve(import.meta.dirname, `../LICENSE`)
const metaPath     = path.resolve(import.meta.dirname, `../meta.json`)
const packagePath  = path.resolve(import.meta.dirname, `../package.json`)
const yearRegExp   = /[0-9]{4}/u

export default async function updateDocs() {

  const date        = new Date
  const releaseYear = date.getFullYear().toString()

  const releaseDate = date.toLocaleDateString(`en-CA`, {
    day:   `2-digit`,
    month: `2-digit`,
    year:  `numeric`,
  })

  const buildTime = (new Date).toISOString()

  // Update meta.json

  const meta = {
    buildTime,
    releaseDate,
    releaseYear,
  }

  await writeJSON(metaPath, meta, { spaces: 2 })

  // Update CITATION.cff

  let   yamlText     = await readFile(citationPath, `utf8`)
  const citationData = yaml.parse(yamlText)
  const packageData  = await readJSON(packagePath)

  citationData.version          = packageData.version
  citationData[`date-released`] = releaseDate

  yamlText = yaml.stringify(citationData)

  await writeFile(citationPath, yamlText)

  // Update LICENSE

  let licenseText = await readFile(licensePath, `utf8`)
  licenseText = licenseText.replace(yearRegExp, releaseYear)
  await writeFile(licensePath, licenseText)

}
