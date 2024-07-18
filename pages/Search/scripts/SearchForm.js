/* global document, localStorage, location */

export default class SearchForm {

  buttons = {}

  fields = {}

  initialize() {

    this.searchButton = document.getElementById(`search-button`)
    this.resetButton  = document.getElementById(`reset-button`)
    this.language     = document.getElementById(`language-select`)
    this.search       = document.getElementById(`search-box`)

    // Populate search form from querystring / local storage.
    // NOTE: Query parameters take precedence over local storage.

    const url = new URL(location.href)

    const query    = url.searchParams.get(`q`)
    const language = url.searchParams.get(`language`) || localStorage.getItem(`language`)

    if (query) this.search.value      = query
    if (language) this.language.value = language

    this.search.focus()

    // Add event listeners

    this.language.addEventListener(`input`, this.saveLanguage.bind(this))

  }

  saveLanguage(ev) {
    localStorage.setItem(`language`, ev.target.value)
  }

}
