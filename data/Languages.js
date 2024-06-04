import { parse as parseCSV } from 'csv-parse/sync'

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

  constructor(csv) {
    super()
    this.csv = csv
    this.convert()
  }

  convert() {

    const records = parseCSV(this.csv, {
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

  toJSON() {
    return Array.from(this.values())
  }

}
