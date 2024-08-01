import path         from 'node:path'
import { readJSON } from 'fs-extra/esm'

export default class CitationKeys extends Map {

  jsonPath = path.resolve(import.meta.dirname, `../json/citationKeys.json`)

  async load() {

    const keys = await readJSON(this.jsonPath)

    for (const [key, surnames] of Object.entries(keys)) {
      this.set(key, surnames)
    }

  }

}
