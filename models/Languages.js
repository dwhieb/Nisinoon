import ndjson                from '../NDJSON.js'
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

  static jsonPath = path.resolve(import.meta.dirname, `../json/languages.ndjson`)

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

  convertRecord({ autonyms = ``, key, name }) {
    return {
      autonyms: autonyms.split(/,\s*/gv).filter(Boolean).map(autonym => autonym.normalize()),
      key,
      name:     name.normalize(),
    }
  }

  async load() {

    if (this.size) return

    const languages = await ndjson.read(Languages.jsonPath)

    for (const lang of languages) {
      this.set(lang.key, lang)
    }

  }

  save() {
    return ndjson.write(this.values(), Languages.jsonPath)
  }

  toJSON() {
    return Array.from(this.values())
  }

}
