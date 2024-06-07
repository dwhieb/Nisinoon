/* eslint func-names: "off", prefer-arrow-callback: "off" */

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
    return this.components.filter(function({
      definition,
      form,
      tokens,
      UR,
    }) {
      return definition?.includes(query)
      || form?.includes(query)
      || UR?.includes(query)
      || tokens.some(function({ form, gloss, UR }) {

        return form?.includes(query)
        || gloss?.includes(query)
        || UR?.includes(query)

      })
    })
  }

}
