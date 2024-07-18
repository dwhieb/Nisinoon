/* eslint no-constructor-return: "off" */

import removeDiacritics from '../utilities/removeDiacritics.js'

export default class Normalizer {

  constructor({ diacritics = false } = {}) {

    if (diacritics) return str => str?.toLowerCase()

    return str => {
      if (typeof str !== `string`) return
      return removeDiacritics(str).toLowerCase()
    }

  }

}
