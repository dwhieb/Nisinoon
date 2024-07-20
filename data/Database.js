/* eslint func-names: "off", prefer-arrow-callback: "off" */

import Components   from './Components.js'
import escapeRegExp from 'escape-string-regexp'
import Languages    from './Languages.js'
import Normalizer   from '../scripts/Normalizer.js'

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
    regex,
  } = {}) {

    const normalize = new Normalizer({ diacritics })
    const q         = normalize(query)
    const pattern   = regex ? q : escapeRegExp(q)
    const regexp    = new RegExp(pattern, `v`)

    // NB: Be careful not to alter the original array here.
    return Array.from(this.components).filter(function({
      definition,
      form,
      language,
      tokens,
      UR,
    }) {

      if (langQuery && langQuery !== `all` && langQuery !== language) return false

      return regexp.test(normalize(definition))
      || regexp.test(normalize(form))
      || regexp.test(normalize(UR))
      || tokens.some(function({
        form,
        gloss,
        UR,
      }) {
        return regexp.test(normalize(form))
        || regexp.test(normalize(gloss))
        || regexp.test(normalize(UR))
      })

    })

  }

}
