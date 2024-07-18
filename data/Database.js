/* eslint func-names: "off", prefer-arrow-callback: "off" */

import Components from './Components.js'
import Languages  from './Languages.js'
import Normalizer from '../scripts/Normalizer.js'

export default class Database {

  components = []

  index = new Components

  languages = new Languages

  async initialize() {
    await this.languages.load()
    await this.index.load()
    this.components = Array.from(this.index.values())
  }

  search(query, {
    diacritics,
    language: langQuery,
  } = {}) {

    const normalize = new Normalizer({ diacritics })
    const q         = normalize(query)

    // NB: Be careful not to alter the original array here.
    return Array.from(this.components).filter(function({
      definition,
      form,
      language,
      PA,
      tokens,
      UR,
    }) {

      if (langQuery && langQuery !== `all` && langQuery !== language) return false

      return normalize(definition)?.includes(q)
      || normalize(form)?.includes(q)
      || normalize(PA)?.includes(q)
      || normalize(UR)?.includes(q)
      || tokens.some(function({
        form,
        gloss,
        PA,
        UR,
      }) {
        return normalize(form)?.includes(q)
        || normalize(gloss)?.includes(q)
        || normalize(PA)?.includes(q)
        || normalize(UR)?.includes(q)
      })

    })

  }

}
