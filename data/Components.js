import Issues                        from './Issues.js'
import Languages                     from './Languages.js'
import ndjson                        from './NDJSON.js'
import Orthographies                 from './Orthographies.js'
import { outputFile }                from 'fs-extra/esm'
import { parse as parseCSV }         from 'csv-parse/sync'
import path                          from 'node:path'
import { readdir }                   from 'node:fs/promises'
import { stringify as stringifyCSV } from 'csv-stringify/sync'

const commaRegExp   = /,\s*/gv
const issues        = new Issues
const languages     = new Languages
const orthographies = new Orthographies

await issues.load()
await languages.load()
await orthographies.load()

const transliterationColumns = [
  { header: `Language`, key: `language` },
  { header: `Orthography`, key: `orthography` },
  { header: `Original Orthography`, key: `originalOrthography` },
  { header: `Project Orthography`, key: `projectOrthography` },
]

function cleanGloss(gl) {
  if (!gl) return ``
  if (gl === `NG`) return ``
  return gl
}

function cleanUR(UR) {
  return UR
  .replace(/^\//v, ``)
  .replace(/\/$/v, ``)
}

export default class Components extends Map {

  static columns = {
    abstractFinal:       `Final: concrete / abstract`,
    baseCategory:        `Base Category (if secondary)`,
    componentID:         `Component ID`,
    componentOf:         `Formative/component occurs in what component(s)`,
    components:          `Contains`,
    definition:          `Project Definition`,
    deverbal:            `Deverbal (y/n)`,
    firstCheck:          `1st check done`,
    gloss:               `Translation`,
    id:                  `ID`,
    matchAI:             `Match AI`,
    matchII:             `Match II`,
    matchTA:             `Match TA`,
    matchTI:             `Match TI`,
    notes:               `Comments`,
    originalOrthography: `Form (original orthography)`,
    orthography:         `Orthography Key Code`,
    pages:               `Page #`,
    proto:               `PA form (original orthography)`,
    reduplicated:        `Initial: Reduplicated`,
    secondaryFinal:      `Final: secondary (y/n/b)`,
    secondCheck:         `2nd check done`,
    sourceCode:          `Source Code`,
    speaker:             `Speaker`,
    stemCategory:        `Stem category`,
    stemGloss:           `Stem translation`,
    stemSubcategory:     `Stem subcategory`,
    stemTranscription:   `Component occurs in stem (orig. orth)`,
    stemUR:              `Stem UR`,
    subcategory:         `Subcategory`,
    type:                `Component Type`,
    UR:                  `UR (if given; if different)`,
  }

  static csvOptions = {
    columns:          true,
    relaxColumnCount: true,
    skipEmptyLines:   true,
    trim:             true,
  }

  static dataDir = path.resolve(import.meta.dirname, `./json/components`)

  transliterations = []

  async convert(language, componentsCSV, tokensCSV) {

    const componentRecords = parseCSV(componentsCSV, Components.csvOptions)
    const tokenRecords     = parseCSV(tokensCSV, Components.csvOptions)
    const records          = new Map
    const cols             = Components.columns

    // Create Map of record IDs => records
    for (const record of componentRecords) {
      records.set(record[cols.id], record)
    }

    // Assign tokens to components
    for (const record of tokenRecords) {

      const component = records.get(record[cols.componentID])

      // Check for nonexistent components
      if (!component) {
        const type        = `UNMATCHED_COMPONENT`
        const componentID = record[cols.componentID]
        const id          = `${ type }-${ language }-${ componentID }`
        const details     = `${ language }: The component ID for token ${ record[cols.form] } does not exist.`
        issues.set(id, { details, id, type })
        continue
      }

      component.tokens ??= []
      component.tokens.push(record)

    }

    for (const record of records.values()) {

      // Check for (and skip) components without tokens
      if (!Array.isArray(record.tokens)) {
        const type        = `MISSING_TOKEN`
        const componentID = record[cols.id]
        const id          = `${ type }-${ language }-${ componentID }`
        const details     = `${ language }: Component ${ componentID } does not have any tokens.`
        issues.set(id, { details, id, type })
        continue
      }

      const data = this.convertRecord(language, record)
      this.set(record[cols.id], data)

    }

    await this.saveTransliterations(language)
    await issues.save()

  }

  convertRecord(language, record) {

    const cols      = Components.columns
    const ortho     = record[cols.orthography]
    const isProto   = language.includes(`Proto`)
    const component = {}

    // Component ID (unique within the language)
    component.componentID = record[cols.id]

    // Global ID (unique within the database)
    component.id = `${ language }-${ record[cols.id] }`

    // Language
    component.displayLanguage = languages.get(language).name

    // Only convert these fields if the orthography is known
    if (ortho !== `UNK`) {

      // Form
      const sourceForm = record[cols.originalOrthography]
      component.form = orthographies.transliterate(ortho, sourceForm)

      // UR
      const sourceUR = record[cols.UR]
      component.UR = orthographies.transliterate(ortho, cleanUR(sourceUR))

      // Proto-Algonquian
      let PA = record[cols.proto]

      if (PA) {
        PA = PA.replace(/^\//v, ``).replace(/\/$/v, ``)
        PA = PA.replace(/^\*/v, ``)
        PA = orthographies.transliterate(ortho, PA)
        PA = `*${ PA }`
      }

      component.PA = PA

    }

    // Definition
    component.definition = cleanGloss(record[cols.definition])

    // Component Type
    component.type = record[cols.type]

    // Tokens
    component.tokens = record.tokens.map(this.convertToken)

    // Save/Return the converted data
    this.transliterations.push({
      language,
      originalOrthography: record[cols.originalOrthography].replaceAll(`-`, `\u2011`),
      orthography:         ortho,
      projectOrthography:  component.form?.replaceAll(`-`, `\u2011`),
    })

    return component

  }

  convertToken(token) {

    const cols  = Components.columns
    const form  = token[cols.originalOrthography]
    const gloss = cleanGloss(token[cols.gloss])
    const UR    = cleanUR(token[cols.UR])

    // Bibliography
    const source = token[cols.sourceCode]

    const pages = token[cols.pages]
    .split(commaRegExp)
    .map(Number)
    .filter(Number.isInteger)

    const bibliography = `${ source }: ${ pages.join(`, `) }`

    return {
      bibliography,
      form,
      gloss,
      UR,
    }

  }

  async load() {

    const filenames = await readdir(Components.dataDir)

    for (const filename of filenames) {
      await this.loadLanguage(path.join(Components.dataDir, filename))
    }

  }

  async loadLanguage(filePath) {

    const components = await ndjson.read(filePath)

    for (const component of components) {
      this.set(component.id, component)
    }

  }

  save(language) {
    const jsonPath = path.join(Components.dataDir, `${ language }.ndjson`)
    return ndjson.write(this.values(), jsonPath)
  }

  async saveTransliterations(language) {

    const csv = stringifyCSV(this.transliterations, {
      bom:     true,
      columns: transliterationColumns,
    })

    const transliterationsPath = path.resolve(import.meta.dirname, `./transliterations/${ language }.csv`)

    await outputFile(transliterationsPath, csv, `utf8`)

  }

  toJSON() {
    return Array.from(this.values())
  }

}
