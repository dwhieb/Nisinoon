import { outputFile }                from 'fs-extra'
import { parse as parseCSV }         from 'csv-parse/sync'
import path                          from 'node:path'
import { readFile }                  from 'node:fs/promises'
import { stringify as stringifyCSV } from 'csv-stringify/sync'

export default class Issues extends Map {

  static columns = [`id`, `type`, `details`]

  static filePath = path.resolve(import.meta.dirname, `issues.csv`)

  async load() {

    const csv     = await readFile(Issues.filePath, `utf8`)
    const records = parseCSV(csv, { columns: Issues.columns })

    for (const record of records) {
      this.set(record.id, record)
    }

  }

  async save() {

    const issues = Array.from(this.values())

    const csv = stringifyCSV(issues, {
      columns: Issues.columns,
      header:  false,
    })

    await outputFile(Issues.filePath, csv)

  }

}
