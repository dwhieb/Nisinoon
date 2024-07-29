/* eslint func-names: "off", prefer-arrow-callback: "off" */

import cleanSearch        from './utilities/cleanSearch.js'
import Components         from './models/Components.js'
import createSearchRegExp from './utilities/createSearchRegExp.js'
import Languages          from './models/Languages.js'
import Normalizer         from './Normalizer.js'

/**
 * NB: Return named function expressions from these methods to make debugging easier.
 */
function createMatchers(query, normalize) {

  const {
    caseSensitive,
    form,
    language,
    regex,
    tags,
    UR,
  } = Object.fromEntries(query)

  return {

    form() {

      const q    = normalize(cleanSearch(form))
      const test = createSearchRegExp(q, { caseSensitive, regex })

      return function testForm(component) {
        if (!component.form) return false
        return test(normalize(component.form))
      }

    },

    /**
     * NB: This function only runs when the "Language" setting is not `all`.
     */
    language() {
      return function testLanguage(component) {
        return component.language === language
      }
    },

    tags() {

      const q    = normalize(cleanSearch(tags))
      const test = createSearchRegExp(q, { caseSensitive, regex })

      return function testTags(component) {
        return component.tags?.some(tag => test(normalize(tag)))
      }

    },

    UR() {

      const q    = normalize(cleanSearch(UR))
      const test = createSearchRegExp(q, { caseSensitive, regex })

      return function testUR(component) {
        if (!component.UR) return false
        return test(normalize(component.UR))
      }

    },

  }

}

export default class Database {

  components = []

  index = new Components

  languages = new Languages

  async initialize() {
    await this.languages.load()
    await this.index.load()
    this.components = Array.from(this.index.values())
  }

  quickSearch(query) {

    const caseSensitive = query.get(`caseSensitive`)
    const diacritics    = query.get(`diacritics`)
    const langQuery     = query.get(`language`)
    const regex         = query.get(`regex`)
    const q             = query.get(`q`)

    // Special case searches without a text query to improve search speed.
    if (!q) {
      if (!langQuery || langQuery === `all`) return Array.from(this.components)
      return Array.from(this.components).filter(({ language }) => language === langQuery)
    }

    // Conduct full search if a text query is not present.

    const normalize = new Normalizer({ caseSensitive, diacritics })

    // NFC normalize original search text first (using `cleanSearch()`), since data in database is also normalized. This allows search results to match the query.
    // Then normalize (in the sense of 'make consistent') the query according to the search options.
    const searchText = normalize(cleanSearch(q))
    const test       = createSearchRegExp(searchText, { caseSensitive, regex })

    return Array.from(this.components).filter(function({
      form,
      language,
      tags,
      tokens,
      UR,
    }) {

      // Special case language filter to improve speed of search.
      if (langQuery && langQuery !== `all` && language !== langQuery) return false

      return tags?.some(tag => test(normalize(tag)))
      || test(normalize(form))
      || test(normalize(UR))
      || tokens.some(function({
        form,
        gloss,
        UR,
      }) {
        return test(normalize(form))
        || test(normalize(gloss))
        || test(normalize(UR))
      })

    })

  }

  search(query) {

    const caseSensitive = query.get(`caseSensitive`)
    const diacritics    = query.get(`diacritics`)
    const language      = query.get(`language`)
    const logic         = query.get(`logic`) ?? `all`

    const normalize = new Normalizer({ caseSensitive, diacritics })
    const matchers  = createMatchers(query, normalize)

    if (language === `all`) delete matchers.language

    const matchFunctions = Object.keys(matchers)
    .filter(field => query.get(field))
    .map(field => matchers[field]())

    const method = logic === `all` ? `every` : `some`

    return Array.from(this.components)
    .filter(component => matchFunctions[method](test => test(component)))

  }

}
