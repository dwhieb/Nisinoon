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
    // NB: Be careful not to alter the original array here.
    return Array.from(this.components).filter(function({
      definition,
      form,
      PA,
      tokens,
      UR,
    }) {
      return definition?.toLowerCase().includes(query)
      || form?.toLowerCase().includes(query)
      || PA?.toLowerCase().includes(query)
      || UR?.toLowerCase().includes(query)
      || tokens.some(function({
        form,
        gloss,
        PA,
        UR,
      }) {
        return form?.toLowerCase().includes(query)
        || gloss?.toLowerCase().includes(query)
        || PA?.toLowerCase().includes(query)
        || UR?.toLowerCase().includes(query)
      })
    })
  }

}
