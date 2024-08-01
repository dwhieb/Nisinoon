import Components    from './models/Components.js'
import Drive         from './Drive.js'
import Languages     from './models/Languages.js'
import Orthographies from './models/Orthographies.js'
import path          from 'node:path'
import ProgressBar   from 'progress'
import { readFile }  from 'node:fs/promises'
import retryRequest  from './utilities/retryRequest.js'
import stringifyCSV  from './utilities/stringifyCSV.js'

import { outputFile, outputJSON } from 'fs-extra/esm'

export default class DataManager {

  drive = new Drive

  languages = new Languages

  orthographies = new Orthographies

  static csvDir = path.resolve(import.meta.dirname, `csv`)

  static jsonDir = path.resolve(import.meta.dirname, `json`)

  /**
   * Convert all the token and component data for all languages and save the data to NDJSON files.
   */
  async convertAllComponents() {

    await this.languages.load()

    const progressBar = new ProgressBar(`:bar`, {
      total: this.languages.size,
    })

    for (const key of this.languages.keys()) {
      await this.convertLanguageComponents(key)
      progressBar.tick()
    }

  }

  /**
   * Convert all the token and component data for a single language to NDJSON.
   * @param {String} key The key for the language to convert.
   */
  async convertLanguageComponents(key) {

    const components     = new Components
    const componentsPath = path.resolve(DataManager.csvDir, `${ key }/components.csv`)
    const tokensPath     = path.resolve(DataManager.csvDir, `${ key }/tokens.csv`)
    const componentsCSV  = await readFile(componentsPath, `utf8`)
    const tokensCSV      = await readFile(tokensPath, `utf8`)

    await components.convert(key, componentsCSV, tokensCSV)
    await components.save(key)

    return components

  }

  /**
   * Converts the languages CSV to a Languages map and saves the data to an NDJSON file.
   */
  async convertLanguages() {

    const csvPath = path.resolve(DataManager.csvDir, `languages.csv`)
    const csv     = await readFile(csvPath, `utf8`)

    this.languages.convert(csv)

    await this.languages.save()

  }

  /**
   * Converts the orthographies CSV and saves the data to an NDJSON file.
   */
  async convertOrthographies() {

    const csvPath = path.resolve(DataManager.csvDir, `orthographies.csv`)
    const csv     = await readFile(csvPath, `utf8`)

    this.orthographies.convert(csv)

    await this.orthographies.save()

  }

  /**
   * Retrieve all the tokens and components for all languages, convert them, and save them to NDJSON files.
   * NOTE: You'll hit Google's rate limit if you run this without the backoff algorithm.
   */
  async fetchAllComponents() {

    await this.languages.load()

    const progressBar = new ProgressBar(`:bar`, {
      total: this.languages.size,
    })

    for (const key of this.languages.keys()) {
      await retryRequest(this.fetchLanguageComponents.bind(this), key)
      progressBar.tick()
    }

  }

  /**
   * Retrieve the mappings of citation keys to author surnames.
   */
  async fetchCitationKeys() {

    const rows = await this.drive.getCitationKeys()

    rows.shift() // Remove header row

    const keys = rows.reduce((hash, [surnames, key]) => {
      hash[key] = surnames
      return hash
    }, {})

    const jsonPath = path.resolve(DataManager.jsonDir, `citationKeys.json`)

    await outputJSON(jsonPath, keys)

  }

  /**
   * Retrieve all the tokens and components for a language and save the data as separate CSV files.
   * @param {String} language The key for the language whose components to fetch.
   */
  async fetchLanguageComponents(language) {

    const data           = await this.drive.getComponentsData(language)
    const componentsCSV  = stringifyCSV(data.components)
    const tokensCSV      = stringifyCSV(data.tokens)
    const componentsPath = path.resolve(DataManager.csvDir, `${ language }/components.csv`)
    const tokensPath     = path.resolve(DataManager.csvDir, `${ language }/tokens.csv`)

    await outputFile(componentsPath, componentsCSV)
    await outputFile(tokensPath, tokensCSV)

  }

  /**
   * Retrieve the languages data and save it as a CSV file.
   */
  async fetchLanguages() {

    const rows    = await this.drive.getLanguagesData()
    const csv     = stringifyCSV(rows)
    const csvPath = path.resolve(DataManager.csvDir, `languages.csv`)

    await outputFile(csvPath, csv)

  }

  async fetchOrthographiesKey() {

    const csv               = await this.drive.getOrthographiesData()
    const orthographiesPath = path.resolve(DataManager.csvDir, `orthographies.csv`)

    await outputFile(orthographiesPath, csv)

  }

  /**
   * Initialize the data manager.
   */
  initialize() {
    return this.drive.initialize()
  }

}
