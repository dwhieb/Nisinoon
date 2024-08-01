/* global document, window */

import SortDirectives from '../../../scripts/SortDirectives.js'

const directivesOrder = [null, `ascending`, `descending`, null]

export default class Results {

  constructor() {
    this.info  = document.getElementById(`results-info`)
    this.limit = document.getElementById(`limit-select`)
    this.table = document.getElementById(`results`)
  }

  initialize() {

    if (this.limit) {
      this.limit.addEventListener(`change`, () => this.limit.form.submit())
    }

    if (this.table) {
      this.table.addEventListener(`click`, this.sort.bind(this))
    }

  }

  render() {
    if (this.info) this.info.scrollIntoView()
  }

  sort(ev) {

    const button = ev.target.closest(`button`)

    if (!button) return

    const { field }  = button.dataset
    const th         = button.parentNode
    const direction  = th.ariaSort
    const url        = new URL(window.location.href)
    const sort       = url.searchParams.get(`sort`)
    const directives = new SortDirectives(sort)
    const directive  = directivesOrder[directivesOrder.indexOf(direction) + 1]

    directives.add(field, directive)

    if (directives.size) {
      url.searchParams.set(`sort`, directives.serialize())
    } else {
      url.searchParams.delete(`sort`)
    }

    window.location = url.href

  }

}
