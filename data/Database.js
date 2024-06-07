import Components from './Components.js'
import Languages  from './Languages.js'

export default class Database {

  components = []

  index = new Components

  languages = new Languages

  async initialize() {
    await this.languages.load()
    await this.index.load()
    this.components = Array.from(this.index.values())
  }

  search(query) {
    return this.components.filter(({ form }) => form.includes(query))
  }

}
