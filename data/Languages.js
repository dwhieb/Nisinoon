import { parse as parseCSV } from 'csv-parse/sync'
import { readFile }          from 'node:fs/promises'

export default class Languages extends Map {

  columns = [
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

  csvOptions = {
    columns:        this.columns,
    from:           2,
    skipEmptyLines: true,
    trim:           true,
  }

  convert() {

    this.records = this.records.filter(record => record.toImport)

    for (const record of this.records) {
      const lang = this.convertRecord(record)
      this.set(lang.key, lang)
    }

    return this

  }

  convertRecord({ key }) {
    return { key }
  }

  json() {
    return Array.from(this.values())
  }

  async readCSV(filePath) {
    this.csv     = await readFile(filePath, `utf8`)
    this.records = parseCSV(this.csv, this.csvOptions)
  }

}
