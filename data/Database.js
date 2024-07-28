/* eslint func-names: "off", prefer-arrow-callback: "off" */

import cleanSearch        from './utilities/cleanSearch.js'
import Components         from './models/Components.js'
import createSearchRegExp from './utilities/createSearchRegExp.js'
import Languages          from './models/Languages.js'
import Normalizer         from './Normalizer.js'

/**
 * NB: I'm using named function expressions here to make debugging easier.
 */
function createMatchers({
  caseSensitive,
  form,
  language,
  regex,
  tags,
}, normalize) {
  return {

    form() {

      const q    = normalize(cleanSearch(form))
      const test = createSearchRegExp(q, { caseSensitive, regex })

      return function testForm(component) {
        if (!component.form) return false
        return test(normalize(component.form))
      }

    },

    language() {
      return function testLanguage(component) {
        if (language === `all` || component.language === language) return true
        return false
      }
    },

    tags() {

      const q    = normalize(cleanSearch(tags))
      const test = createSearchRegExp(q, { caseSensitive, regex })

      return function testTags(component) {
        return component.tags?.some(tag => test(normalize(tag)))
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

  /**
   * NB: Be careful not to alter the original components array within this method.
   */
  quickSearch({
    caseSensitive,
    diacritics,
    language: langQuery,
    regex,
    q,
  } = {}) {

    // Special case searches without a text query to improve search speed.
    if (!q) {
      if (!langQuery || langQuery === `all`) return Array.from(this.components)
      return Array.from(this.components).filter(({ language }) => language === langQuery)
    }

    // Conduct full search if a text query is not present.

    const normalize = new Normalizer({ caseSensitive, diacritics })

    // NFC normalize original search text first (using `cleanSearch()`), since data in database is also normalized. This allows search results to match the query.
    // Then normalize (in the sense of 'make consistent') the query according to the search options.
    const query = normalize(cleanSearch(q))
    const test  = createSearchRegExp(query, { caseSensitive, regex })

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

  /**
   * Advanced Search
   * @param   {Object} [options={}] The querystring parameters.
   * @returns {Array}
   */
  search(query = {}) {

    const { caseSensitive, diacritics } = query

    const normalize    = new Normalizer({ caseSensitive, diacritics })
    const matchers     = createMatchers(query, normalize)

    const matchFunctions = Object.keys(matchers)
    .filter(field => query[field])
    .map(field => matchers[field]())

    return Array.from(this.components)
    .filter(component => matchFunctions.every(test => test(component)))

  }

}
