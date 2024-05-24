import Drive         from './Drive.js'
import Languages     from './Languages.js'
import ndjson        from '../database/NDJSON.js'
import path          from 'node:path'
import ProgressBar   from 'progress'
import { writeFile } from 'node:fs/promises'

export default class DataManager {

  csvDir = path.resolve(import.meta.dirname, `csv`)

  drive = new Drive

  jsonDir = path.resolve(import.meta.dirname, `json`)

  /**
   * Convert the languages CSV data and save it as an NDJSON file.
   */
  async convertLanguages() {

    const csvPath   = path.resolve(this.csvDir, `languages.csv`)
    const jsonPath  = path.resolve(this.jsonDir, `languages.ndjson`)
    const languages = new Languages

    await languages.readCSV(csvPath)
    languages.convert()

    await ndjson.write(languages.json(), jsonPath)

  }

  /**
   * Retrieve all the components for all languages and save them as CSV files.
   */
  async fetchComponents() {

    if (!this.languages) await this.loadLanguages()

    const progress = new ProgressBar(`:bar`, {
      total: this.languages.size,
    })

    for (const key of this.languages.keys()) {
      await this.fetchLanguage(key)
      progress.tick()
    }

  }

  /**
   * Retrieve all the components for a language and save the data to CSV.
   * @param {String} language The key for the language whose components to fetch.
   */
  async fetchLanguage(language) {
    const csv     = await this.drive.getSpreadsheetByName(language)
    const outPath = path.resolve(this.csvDir, `${ language }.csv`)
    await writeFile(outPath, csv, `utf8`)
  }

  /**
   * Retrieve the data from the Languages spreadsheet and save it to `languages.csv`.
   */
  async fetchLanguages() {
    const csv     = await this.drive.getLanguagesData()
    const outPath = path.resolve(this.csvDir, `languages.csv`)
    await writeFile(outPath, csv, `utf8`)
  }

  /**
   * Initialize the data manager.
   */
  initialize() {
    return this.drive.initialize()
  }

  /**
   * Load the languages data from the NDJSON file to a Map.
   */
  async loadLanguages() {

    const jsonPath = path.resolve(this.jsonDir, `languages.ndjson`)
    const data     = await ndjson.read(jsonPath)

    this.languages = data.reduce((map, lang) => {
      map.set(lang.key, lang)
      return map
    }, new Map)

  }

}

const manager = new DataManager

await manager.initialize()
