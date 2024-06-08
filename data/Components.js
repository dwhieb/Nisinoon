import Issues                        from './Issues.js'
import Languages                     from './Languages.js'
import ndjson                        from './NDJSON.js'
import Orthographies                 from './Orthographies.js'
import { outputFile }                from 'fs-extra/esm'
import { parse as parseCSV }         from 'csv-parse/sync'
import path                          from 'node:path'
import { readdir }                   from 'node:fs/promises'
import { stringify as stringifyCSV } from 'csv-stringify/sync'

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
    citationKey:         `Source Code`,
    componentID:         `Component ID`,
    componentOf:         `Formative/component occurs in what component(s)`,
    components:          `Contains`,
    definition:          `Project Definition`,
    deverbal:            `Deverbal (y/n)`,
    etymon:              `PA form (original orthography)`,
    firstCheck:          `1st check done`,
    gloss:               `Translation`,
    id:                  `ID`,
    locator:             `Page #`,
    matchAI:             `Match AI`,
    matchII:             `Match II`,
    matchTA:             `Match TA`,
    matchTI:             `Match TI`,
    notes:               `Comments`,
    originalOrthography: `Form (original orthography)`,
    orthography:         `Orthography Key Code`,
    reduplicated:        `Initial: Reduplicated`,
    secondaryFinal:      `Final: secondary (y/n/b)`,
    secondCheck:         `2nd check done`,
    slot:                `Component Type`,
    speaker:             `Speaker`,
    stemCategory:        `Stem category`,
    stemGloss:           `Stem translation`,
    stemSubcategory:     `Stem subcategory`,
    stemTranscription:   `Component occurs in stem (orig. orth)`,
    stemUR:              `Stem UR`,
    subcategory:         `Subcategory`,
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

    const cols  = Components.columns
    const ortho = record[cols.orthography]

    // Component ID (unique within the language)
    const componentID = record[cols.id]

    // Global ID (unique within the database)
    const id = `${ language }-${ record[cols.id] }`

    // Language
    const displayLanguage = languages.get(language).name

    // Form
    const sourceForm = record[cols.originalOrthography]
    const form       = orthographies.transliterate(ortho, sourceForm)

    // UR
    const sourceUR = record[cols.UR]
    const UR       = orthographies.transliterate(ortho, cleanUR(sourceUR))

    // Definition
    const definition = cleanGloss(record[cols.definition])

    // Tokens
    const tokens = record.tokens.map(this.convertToken)

    // Save/Return the converted data
    this.transliterations.push({
      language,
      originalOrthography: sourceForm.replaceAll(`-`, `\u2011`),
      orthography:         ortho,
      projectOrthography:  form.replaceAll(`-`, `\u2011`),
    })

    return {
      componentID,
      definition,
      displayLanguage,
      form,
      id,
      language,
      tokens,
      UR,
    }

  }

  convertToken(token) {

    const cols  = Components.columns
    const form  = token[cols.originalOrthography]
    const gloss = cleanGloss(token[cols.gloss])
    const UR    = cleanUR(token[cols.UR])

    return { form, gloss, UR }

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
