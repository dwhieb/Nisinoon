import path       from 'node:path'
import readNDJSON from './readNDJSON.js'

export default class Database {

  #data = []

  #dataPath = path.resolve(import.meta.dirname, `./data.ndjson`)

  async initialize() {
    this.#data = await readNDJSON(this.#dataPath)
  }

  search(filterFunction) {
    return this.#data.filter(filterFunction)
  }

}
