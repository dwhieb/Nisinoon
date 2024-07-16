/* global document, window */

import SortDirectives from '../../../scripts/SortDirectives.js'

const directivesOrder = [null, `ascending`, `descending`, null]

export default class Table {

  initialize() {
    this.el = document.getElementById(`results`)
    if (!this.el) return
    this.el.addEventListener(`click`, this.sort.bind(this))
  }

  sort(ev) {

    const button = ev.target.closest(`button`)

    if (!button) return

    const { field }  = button.dataset
    const th         = button.parentNode
    const direction  = th.ariaSort
    const url        = new URL(window.location.href)
    let   sort       = url.searchParams.get(`sort`)
    const directives = new SortDirectives(sort)
    const directive  = directivesOrder[directivesOrder.indexOf(direction) + 1]

    directives.add(field, directive)
    sort = directives.serialize()
    url.searchParams.set(`sort`, sort)
    window.location = url.href

  }

}
