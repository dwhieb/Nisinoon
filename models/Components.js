import Allomorph                     from './Allomorph.js'
import Component                     from './Component.js'
import groupColumns                  from '../utilities/groupColumns.js'
import Issues                        from '../Issues.js'
import Languages                     from './Languages.js'
import ndjson                        from '../NDJSON.js'
import Orthographies                 from './Orthographies.js'
import { outputFile }                from 'fs-extra/esm'
import { parse as parseCSV }         from 'csv-parse/sync'
import path                          from 'node:path'
import { readdir }                   from 'node:fs/promises'
import Stem                          from './Stem.js'
import { stringify as stringifyCSV } from 'csv-stringify/sync'
import Token                         from './Token.js'

const issues        = new Issues
const languages     = new Languages
const orthographies = new Orthographies

await issues.load()
await languages.load()
await orthographies.load()

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
    tags:                `Tags`,
    type:                `Component Type`,
    UR:                  `UR (if given; if different)`,
  }

  static csvOptions = {
    columns:          true,
    relaxColumnCount: true,
    skipEmptyLines:   true,
    trim:             true,
  }

  static dataDir = path.resolve(import.meta.dirname, `../json/components`)

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

      const data = this.convertComponent(record, language)
      this.set(record[cols.ID], data)

    }

    await this.saveTransliterations(language)
    await issues.save()

  }

  convertComponent(record, language) {

    const cols  = Components.columns
    const ortho = record[cols.orthography]

    const allomorphs = groupColumns(record, cols.allomorph, cols.condition)
    .map(data => new Allomorph(orthographies.transliterate(ortho, data[cols.allomorph]), data[cols.condition]))

    const baseCategories = groupColumns(record, cols.baseCategory)
    .map(({ [cols.baseCategory]: baseCategory }) => baseCategory)

    const components = groupColumns(record, cols.components)
    .map(({ [cols.components]: reference }) => orthographies.transliterate(ortho, reference.normalize()))

    const containedIn = groupColumns(record, cols.containedIn)
    .map(({ [cols.containedIn]: reference }) => orthographies.transliterate(ortho, reference))

    const formatives = groupColumns(record, cols.formatives)
    .map(({ [cols.formatives]: reference }) => orthographies.transliterate(ortho, reference.normalize()))

    const component = new Component({
      allomorphs,
      baseCategories,
      components,
      containedIn,
      definition:      record[cols.definition],
      deverbal:        record[cols.deverbal],
      deverbalFrom:    record[cols.deverbalFrom],
      dialect:         record[cols.dialect],
      displayLanguage: languages.get(language).name,
      finalType:       record[cols.finalType],
      form:            record[cols.originalOrthography],
      formatives,
      Glottocode:      record[cols.Glottocode],
      ID:              record[cols.ID],
      ISO:             record[cols.ISO],
      language,
      matchAI:         record[cols.matchAI],
      matchII:         record[cols.matchII],
      matchTA:         record[cols.matchTA],
      matchTI:         record[cols.matchTI],
      notes:           record[cols.notes],
      orthography:     record[cols.orthography],
      PA:              record[cols.proto],
      specificity:     record[cols.specificity],
      subcategory:     record[cols.subcategory],
      type:            record[cols.type],
      UR:              record[cols.UR],
    })

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
      [cols.stemSource]:      stemSource,
      [cols.stemSubcategory]: subcategory,
      [cols.stemUR]:          UR,
    }) => new Stem({
      category,
      form,
      gloss,
      secondary,
      stemSource,
      subcategory,
      UR,
    }))

    if (stems.length) component.stems = stems

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

  convertToken(record, language) {

    const cols = Components.columns

    return new Token({
      bibliography: record[cols.bibliography],
      form:         record[cols.originalOrthography],
      gloss:        record[cols.gloss],
      language,
      notes:        record[cols.notes],
      orthography:  record[cols.orthography],
      PA:           record[cols.proto],
      pages:        record[cols.pages],
      source:       record[cols.sourceCode],
      speaker:      record[cols.speaker],
      UR:           record[cols.UR],
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
      columns: [
        { header: `Language`, key: `language` },
        { header: `Orthography`, key: `orthography` },
        { header: `Original Orthography`, key: `originalOrthography` },
        { header: `Project Orthography`, key: `projectOrthography` },
      ],
    })

    const transliterationsPath = path.resolve(import.meta.dirname, `../transliterations/${ language }.csv`)

    await outputFile(transliterationsPath, csv, `utf8`)

  }

  toJSON() {
    return Array.from(this.values())
  }

}
