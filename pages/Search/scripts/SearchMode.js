/* global document, history, localStorage, location */

export default class SearchMode {

  constructor() {
    this.advanced = document.getElementById(`advanced-option`)
    this.fieldset = document.getElementById(`search-mode`)
  }

  listen() {
    this.fieldset.addEventListener(`input`, this.save.bind(this))
  }

  render() {

    const url   = new URL(location.href)
    const query = url.searchParams

    if (query.size) return

    this.advanced.checked = localStorage.getItem(`advanced`) === `true`

  }

  save() {

    const url      = new URL(location.href)
    const advanced = this.advanced.checked

    if (advanced) {
      localStorage.setItem(`advanced`, `true`)
      url.searchParams.set(`advanced`, `true`)
    } else {
      localStorage.removeItem(`advanced`)
      url.searchParams.delete(`advanced`)
    }

    // NB: The second parameter to this method is deprecated and does nothing.
    // It's just there because it's required by the method signature.
    history.pushState({}, document.title, url.href)


  }

}
