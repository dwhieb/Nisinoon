import { readFile } from 'node:fs/promises'

export default class Components extends Array {

  csvOptions = {
    columns:        true,
    skipEmptyLines: true,
    trim:           true,
  }

  convert() {
    for (const record of this.records) {
      const component = this.convertRecord(record)
      this.push(component)
    }
  }

  convertRecord(record) {
    return record
  }

  async readCSV(filePath) {
    this.csv     = await readFile(filePath, `utf8`)
    this.records = parseCSV(this.csv, this.csvOptions)
  }

}
