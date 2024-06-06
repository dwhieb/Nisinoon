import ndjson                from './NDJSON.js'
import { parse as parseCSV } from 'csv-parse/sync'
import path                  from 'node:path'

export default class Languages extends Map {

  static columns = [
    `key`,
    `toImport`,
    `name`,
    `abbreviation`,
    `iso`,
    `glottocode`,
    `exonyms`,
    `autonyms`,
    `dialects`,
    `notes`,
  ]

  convert(csv) {

    const records = parseCSV(csv, {
      columns:          Languages.columns,
      from:             2,
      relaxColumnCount: true,
      skipEmptyLines:   true,
      trim:             true,
    })
    .filter(record => record.toImport)

    for (const record of records) {
      const language = this.convertRecord(record)
      this.set(language.key, language)
    }

    return this

  }

  convertRecord({ key }) {
    return { key }
  }

  get jsonPath() {
    return path.resolve(
      import.meta.dirname,
      process.env.DATABASE === `testing` ? `../test/fixtures/languages.ndjson` : `./json/languages.ndjson`,
    )
  }

  async load() {

    const languages = await ndjson.read(this.jsonPath)

    for (const lang of languages) {
      this.set(lang.key, lang)
    }

  }

  save() {
    return ndjson.write(this.values(), this.jsonPath)
  }

  toJSON() {
    return Array.from(this.values())
  }

}
