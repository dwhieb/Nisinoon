import Components from '../data/Components.js'
import Languages  from '../data/Languages.js'

export default class Database {

  components = []

  index = new Components

  languages = new Languages

  async initialize() {
    await this.languages.load()
    await this.index.load()
    this.components = Array.from(this.index.values())
  }

  search(filterFunction) {
    return this.components.filter(filterFunction)
  }

}
