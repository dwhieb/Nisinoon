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

  quickSearch({
    caseSensitive,
    diacritics,
    language: langQuery,
    regex,
    q,
  } = {}) {

    const normalize = new Normalizer({ caseSensitive, diacritics })

    // NFC normalize original search text first, since data in database is also normalized.
    // This allows search results to match the query.
    // Then normalize (in the sense of 'make consistent') the query according to the search options.
    const query = normalize(q.trim().normalize())

    const pattern = regex ? query : escapeRegExp(query)
    const flags   = caseSensitive ? `v` : `iv`
    const regexp  = new RegExp(pattern, flags)

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

  /**
   * Advanced Search
   * @param   {Object} [options={}] The querystring parameters.
   * @returns {Array}
   */
  search(options = {}) {
    return Array.from(this.components)
  }

}
