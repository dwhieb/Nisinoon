/* eslint func-names: "off", prefer-arrow-callback: "off" */

import Components   from './models/Components.js'
import escapeRegExp from 'escape-string-regexp'
import Languages    from './models/Languages.js'
import Normalizer   from './Normalizer.js'

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
    caseSensitive,
    diacritics,
    language: langQuery,
    regex,
  } = {}) {

    const normalize = new Normalizer({ caseSensitive, diacritics })
    const q         = normalize(query)
    const pattern   = regex ? q : escapeRegExp(q)
    const flags     = caseSensitive ? `v` : `iv`
    const regexp    = new RegExp(pattern, flags)

    // NB: Be careful not to alter the original array here.
    return Array.from(this.components).filter(function({
      form,
      language,
      tags,
      tokens,
      UR,
    }) {

      if (langQuery && langQuery !== `all` && langQuery !== language) return false

      return tags?.some(tag => regexp.test(normalize(tag)))
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
