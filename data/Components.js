import Issues                from './Issues.js'
import { parse as parseCSV } from 'csv-parse/sync'

const issues = new Issues

await issues.load()

export default class Components extends Map {

  csv = {}

  static columns = {
    abstractFinal:     `Final: concrete / abstract`,
    baseCategory:      `Base Category (if secondary)`,
    citationKey:       `Source Code`,
    componentID:       `Component ID`,
    componentOf:       `Formative/component occurs in what component(s)`,
    components:        `Contains`,
    deverbal:          `Deverbal (y/n)`,
    etymon:            `PA form (original orthography)`,
    firstCheck:        `1st check done`,
    form:              `Form (original orthography)`,
    gloss:             `Translation`,
    id:                `ID`,
    locator:           `Page #`,
    matchAI:           `Match AI`,
    matchII:           `Match II`,
    matchTA:           `Match TA`,
    matchTI:           `Match TI`,
    notes:             `Comments`,
    orthography:       `Orthography Key Code`,
    reduplicated:      `Initial: Reduplicated`,
    secondaryFinal:    `Final: secondary (y/n/b)`,
    secondCheck:       `2nd check done`,
    slot:              `Component Type`,
    speaker:           `Speaker`,
    stemCategory:      `Stem category`,
    stemGloss:         `Stem translation`,
    stemSubcategory:   `Stem subcategory`,
    stemTranscription: `Component occurs in stem (orig. orth)`,
    stemUR:            `Stem UR`,
    subcategory:       `Subcategory`,
    UR:                `UR (if given; if different)`,
  }

  static csvOptions = {
    columns:          true,
    relaxColumnCount: true,
    skipEmptyLines:   true,
    trim:             true,
  }

  constructor(componentsCSV, tokensCSV, language) {
    super()
    this.csv.components = componentsCSV
    this.csv.tokens     = tokensCSV
    this.language       = language
    this.convert()
  }

  convert() {

    const componentRecords = parseCSV(this.csv.components, Components.csvOptions)
    const tokenRecords     = parseCSV(this.csv.tokens, Components.csvOptions)

    const records = new Map
    const cols    = Components.columns

    // Create Map of records
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
        const id          = `${ type }-${ this.language }-${ componentID }`
        const details     = `${ this.language }: The component ID for token ${ record[cols.form] } does not exist.`
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
        const id          = `${ type }-${ this.language }-${ componentID }`
        const details     = `${ this.language }: Component ${ componentID } does not have any tokens.`
        issues.set(id, { details, id, type })
        continue
      }

      this.set(record[cols.id], this.convertRecord(record))

    }

    issues.save() // Don't await the promise, to keep convert() method sync

  }

  convertRecord(record) {

    const cols = Components.columns
    const id   = record[cols.id]

    return { id }

  }

  toJSON() {
    return Array.from(this.values())
  }

}
