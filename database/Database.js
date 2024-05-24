import ndjson from './NDJSON.js'
import path   from 'node:path'

export default class Database {

  #data = []

  #dataPath = path.resolve(import.meta.dirname, `./data.ndjson`)

  async initialize() {
    this.#data = await ndjson.read(this.#dataPath)
  }

  search(filterFunction) {
    return this.#data.filter(filterFunction)
  }

}
