/* eslint no-constructor-return: "off" */

import removeDiacritics from '../utilities/removeDiacritics.js'

export default class Normalizer {

  constructor({
    caseSensitive = false,
    diacritics = false,
  } = {}) {

    return str => {
      if (typeof str !== `string`) return
      if (!caseSensitive) str = str.toLowerCase()
      if (!diacritics) str = removeDiacritics(str)
      return str
    }

  }

}
