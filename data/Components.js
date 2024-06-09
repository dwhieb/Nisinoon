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

function cleanProto(form) {
  return form
  .replace(/^\//v, ``)
  .replace(/\/$/v, ``)
  .replace(/^-\*/v, `-`)
  .replace(/^\*/v, ``)
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
    dialect:             `Dialect`,
    firstCheck:          `1st check done`,
    gloss:               `Translation`,
    Glottocode:          `Glottocode`,
    ID:                  `ID`,
    ISO:                 `ISO code`,
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
      records.set(record[cols.ID], record)
    }

    // Assign tokens to components
    for (const record of tokenRecords) {

      const component = records.get(record[cols.componentID])

      // Check for nonexistent components
      if (!component) {
        const type        = `UNMATCHED_COMPONENT`
        const componentID = record[cols.componentID]
        const ID          = `${ type }-${ language }-${ componentID }`
        const details     = `${ language }: The component ID for token ${ record[cols.form] } does not exist.`
        issues.set(ID, { details, ID, type })
        continue
      }

      component.tokens ??= []
      component.tokens.push(record)

    }

    for (const record of records.values()) {

      // Check for (and skip) components without tokens
      if (!Array.isArray(record.tokens)) {
        const type        = `MISSING_TOKEN`
        const componentID = record[cols.ID]
        const ID          = `${ type }-${ language }-${ componentID }`
        const details     = `${ language }: Component ${ componentID } does not have any tokens.`
        issues.set(ID, { details, ID, type })
        continue
      }

      const data = this.convertRecord(language, record)
      this.set(record[cols.ID], data)

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
    component.componentID = record[cols.ID]

    // Global ID (unique within the database)
    component.ID = `${ language }-${ record[cols.ID] }`

    // Language
    component.language        = language
    component.displayLanguage = languages.get(language).name

    // Dialect
    component.dialect = record[cols.dialect]

    // Glottocode
    component.Glottocode = record[cols.Glottocode]

    // ISO 639-3
    component.ISO = record[cols.ISO]

    // Only convert these fields if the orthography is known
    if (ortho !== `UNK`) {

      // Form
      let form = record[cols.originalOrthography]
      if (isProto) form = cleanProto(form)
      form = orthographies.transliterate(ortho, form)
      if (isProto && form) form = `*${ form }`
      component.form = form

      // UR
      const sourceUR = record[cols.UR]
      component.UR = orthographies.transliterate(ortho, cleanUR(sourceUR))

      // Proto-Algonquian
      let PA = record[cols.proto]

      if (PA) {
        PA = cleanProto(PA)
        PA = orthographies.transliterate(ortho, PA)
        PA = `*${ PA }`
      }

      component.PA = PA

    }

    // Definition
    component.definition = cleanGloss(record[cols.definition])

    // Component Type
    component.type = record[cols.type]

    // Subcategory
    component.subcategory = record[cols.subcategory]

    // Tokens
    component.tokens = record.tokens.map(token => this.convertToken(token, language))

    // Save/Return the converted data
    this.transliterations.push({
      language,
      originalOrthography: record[cols.originalOrthography].replaceAll(`-`, `\u2011`),
      orthography:         ortho,
      projectOrthography:  component.form?.replaceAll(`-`, `\u2011`),
    })

    return component

  }

  convertToken(token, language) {

    const cols    = Components.columns
    const isProto = language.includes(`Proto`)

    // Form
    let form = token[cols.originalOrthography]

    if (isProto && form) {
      form = cleanProto(form)
      form = `*${ form }`
    }

    // UR
    const UR = cleanUR(token[cols.UR])

    // Proto-Algonquian
    const PA = token[cols.proto]

    // Gloss
    const gloss = cleanGloss(token[cols.gloss])

    // Bibliography
    const source = token[cols.sourceCode]

    let   bibliography = source
    const pages        = token[cols.pages]

    if (pages) {

      bibliography += `: `

      bibliography += token[cols.pages]
      .split(commaRegExp)
      .map(Number)
      .filter(Number.isInteger)
      .join(`, `)

    }

    return {
      bibliography,
      form,
      gloss,
      PA,
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
      this.set(component.ID, component)
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
