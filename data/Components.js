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

function groupColumns(record, ...colTypes) {

  const keys  = Object.keys(record)
  const items = []

  for (const colType of colTypes) {

    const letteredColumns = keys.filter(key => key.startsWith(colType))

    for (const letteredColumn of letteredColumns) {

      const [, letter] = letteredColumn.split(`-`)
      const i          = letterToIndex(letter)
      const data       = record[letteredColumn]

      if (data) {
        items[i]    ??= {}
        const item    = items.at(i)
        item[colType] = data
      }

    }

  }

  return items.filter(Boolean)

}

function letterToIndex(letter) {
  return letter.toLowerCase().charCodeAt(0) - 97
}

function parsePages(pagesString) {
  return pagesString
  .split(commaRegExp)
  .map(Number)
  .filter(Number.isInteger)
  .join(`, `)
}

class Allomorph {
  constructor(form, condition) {
    this.form = form
    if (condition) this.condition = condition
  }
}

class Matches {
  constructor({
    AI, II, TA, TI,
  }) {
    if (AI) this.AI = AI
    if (II) this.II = II
    if (TA) this.TA = TA
    if (TI) this.TI = TI
  }
}

class Token {
  constructor({
    bibliography,
    form,
    gloss,
    PA,
    speaker,
    UR,
  }) {
    if (bibliography) this.bibliography = bibliography
    if (form) this.form = form
    if (gloss) this.gloss = gloss
    if (PA) this.PA = PA
    if (speaker) this.speaker = speaker
    if (UR) this.UR = UR
  }
}

export default class Components extends Map {

  static columns = {
    allomorph:           `Allomorph`,
    baseCategory:        `Base Category (if secondary)`,
    componentID:         `Component ID`,
    components:          `Contains component (enter)`,
    condition:           `Condition`,
    containedIn:         `Formative/component occurs in what component(s)`,
    definition:          `Project Definition`,
    deverbal:            `Deverbal (y/n)`,
    deverbalFrom:        `Deverbal from`,
    dialect:             `Dialect`,
    finalType:           `Final: secondary (y/n/b)`,
    firstCheck:          `1st check done`,
    formatives:          `Contains formative (enter)`,
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
    secondCheck:         `2nd check done`,
    sourceCode:          `Source Code`,
    speaker:             `Speaker`,
    specificity:         `Final: concrete / abstract`,
    stemCategory:        `Stem category`,
    stemForm:            `Component occurs in stem (orig. orth)`,
    stemGloss:           `Stem translation`,
    stemSecondary:       `Secondary stem`,
    stemSource:          `Stem Source`,
    stemSubcategory:     `Stem subcategory`,
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

    if (component.type === `initial`) {

      // Initial: Reduplicated
      component.reduplicated = record[cols.reduplicated] === `Y`

    }

    if (component.type === `final`) {

      // Final: Concrete/Abstract
      component.specificity = record[cols.specificity]

      // Final: Primary/Secondary
      const finalType = record[cols.finalType]

      component.primary   = finalType === `B` || !finalType
      component.secondary = finalType === `B` || finalType === `Y`

    }

    // Base Categories
    if (component.secondary) {

      const baseCategories = groupColumns(record, cols.baseCategory)
      .map(({ [cols.baseCategory]: baseCategory }) => baseCategory)

      if (baseCategories.length) component.baseCategories = baseCategories

    }

    // Deverbal
    component.deverbal = record[cols.deverbal] === `Y`

    if (component.deverbal) {
      component.deverbalFrom = record[cols.deverbalFrom]
    }

    // Matches
    component.matches = new Matches({
      AI: orthographies.transliterate(ortho, record[cols.matchAI]),
      II: orthographies.transliterate(ortho, record[cols.matchII]),
      TA: orthographies.transliterate(ortho, record[cols.matchTA]),
      TI: orthographies.transliterate(ortho, record[cols.matchTI]),
    })

    // Allomorphs
    const allomorphs = groupColumns(record, cols.allomorph, cols.condition)
    .map(data => new Allomorph(orthographies.transliterate(ortho, data[cols.allomorph]), data[cols.condition]))

    if (allomorphs.length) component.allomorphs = allomorphs

    // Cross-References
    const containedIn = groupColumns(record, cols.containedIn)
    .map(({ [cols.containedIn]: reference }) => reference)

    if (containedIn.length) component.containedIn = containedIn

    const components = groupColumns(record, cols.components)
    .map(({ [cols.components]: reference }) => reference)

    if (components.length) component.components = components

    const formatives = groupColumns(record, cols.formatives)
    .map(({ [cols.formatives]: reference }) => reference)

    if (formatives.length) component.formatives = formatives

    // Stems
    const stems = groupColumns(
      record,
      cols.stemCategory,
      cols.stemForm,
      cols.stemGloss,
      cols.stemSecondary,
      cols.stemSource,
      cols.stemSubcategory,
      cols.stemUR,
    ).map(({
      [cols.stemCategory]:    category,
      [cols.stemForm]:        form,
      [cols.stemGloss]:       gloss,
      [cols.stemSecondary]:   secondary,
      [cols.stemSource]:      rawSource,
      [cols.stemSubcategory]: subcategory,
      [cols.stemUR]:          UR,
    }) => {

      const stem = {
        category,
        form:      orthographies.transliterate(ortho, form),
        gloss,
        secondary: secondary === `Y`,
        subcategory,
        UR,
      }

      if (rawSource) {
        const [source, pages] = rawSource.split(`;`)
        if (pages) stem.source = `${ source }: ${ parsePages(pages) }`
        else stem.source = source
      }

      return stem

    })

    if (stems.length) component.stems = stems

    // Notes
    const notes = record[cols.notes]
    if (notes) component.notes = notes

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
      bibliography += parsePages(token[cols.pages])
    }

    // Speaker
    const speaker = token[cols.speaker]

    return new Token({
      bibliography,
      form,
      gloss,
      PA,
      speaker,
      UR,
    })

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
