import { parse as parseCSV } from 'csv-parse/sync'
import path                  from 'node:path'
import { Transliterator }    from '@digitallinguistics/transliterate'

import { outputFile, readJSON } from 'fs-extra/esm'

const PROJECT     = `Project Orthography`
const commaRegExp = /,\s*/gv

export default class Orthographies extends Map {

  csvOptions = {
    columns:        true,
    skipEmptyLines: true,
    trim:           true,
  }

  transliterators = new Map

  static csvPath = path.resolve(import.meta.dirname, `./csv/orthographies.csv`)

  static jsonPath = path.resolve(import.meta.dirname, `./json/orthographies.json`)

  convert(csv) {

    const records          = parseCSV(csv, this.csvOptions)
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

      transliterationRules.toJSON = function toJSON() {
        return Object.fromEntries(this)
      }

      this.set(ortho, transliterationRules)

    }

    return this

  }

  async load() {

    const data = await readJSON(Orthographies.jsonPath)

    for (const [ortho, rules] of Object.entries(data)) {
      this.set(ortho, new Map(Object.entries(rules)))
    }

  }

  save() {
    const json = JSON.stringify(this)
    return outputFile(Orthographies.jsonPath, json)
  }

  toJSON() {
    return Object.fromEntries(this)
  }

  /**
   * Transliterates a string from the specified orthography to the project orthography.
   * @param {String} ortho The orthography to transliterate from.
   * @param {String} data  The string to transliterate.
   * @return {String}
   */
  transliterate(ortho, data) {

    if (ortho === `UNK`) return ``

    const rules = this.get(ortho)

    // Adjust which of these returns is commented out depending on whether you want errors in the output.
    if (!rules) {
      // return `ERROR: Orthography ${ ortho } not recognized.` // Use this for finding missing orthographies.
      return ``
    }

    let transliterate = this.transliterators.get(ortho)

    if (!transliterate) {
      transliterate = new Transliterator(rules)
      this.transliterators.set(ortho, transliterate)
    }

    return transliterate(data)

  }

}
