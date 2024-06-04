import { parse as parseCSV } from 'csv-parse/sync'

const PROJECT     = `Project Orthography`
const commaRegExp = /,\s*/gv

export default class Orthographies extends Map {

  csvOptions = {
    columns:        true,
    skipEmptyLines: true,
    trim:           true,
  }

  constructor(csv) {
    super()
    this.csv = csv
    this.convert()
  }

  async convert() {

    const records          = parseCSV(this.csv, this.csvOptions)
    const orthographyNames = Object.keys(records[0]).slice(1)

    for (const ortho of orthographyNames) {

      const transliterationRules = records.reduce((map, record) => {

        const input = record[ortho]

        if (!input) return map

        const graphemes = input.split(commaRegExp)

        for (const grapheme of graphemes) {
          map.set(grapheme.trim(), record[PROJECT])
        }

        return map

      }, new Map)

      transliterationRules.toJSON = function() {
        return Object.fromEntries(this)
      }

      this.set(ortho, transliterationRules)

    }

    return this

  }

  toJSON() {
    return Object.fromEntries(this)
  }

}
