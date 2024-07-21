import cleanGloss    from '../utilities/cleanGloss.js'
import cleanUR       from '../utilities/cleanUR.js'
import Orthographies from './Orthographies.js'
import parsePages    from '../utilities/parsePages.js'

const orthographies = new Orthographies

await orthographies.load()

export default class Stem {

  constructor({
    category,
    form,
    gloss,
    orthography,
    secondary,
    stemSource,
    subcategory,
    UR,
  } = {}) {

    if (category) this.category = category
    this.form = orthographies.transliterate(orthography, form)
    if (gloss) this.gloss = cleanGloss(gloss)
    this.secondary = secondary === `Y`
    if (subcategory) this.subcategory = subcategory
    if (UR) this.UR = cleanUR(UR)

    if (stemSource) {

      const [source, pages] = stemSource.split(`;`)

      if (pages) this.source = `${ source }: ${ parsePages(pages) }`
      else this.source = source

    }

  }

}
