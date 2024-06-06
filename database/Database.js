import Components from '../data/Components.js'
import Languages  from '../data/Languages.js'

export default class Database {

  components = new Components

  languages = new Languages

  async initialize() {

    await this.languages.load()
    await this.components.load()

  }

  search(filterFunction) {
    return this.components.filter(filterFunction)
  }

}
