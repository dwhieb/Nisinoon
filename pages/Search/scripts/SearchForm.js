/* global document, window */

export default class SearchForm {

  initialize() {

    this.search   = document.getElementById(`search-box`)
    this.language = document.getElementById(`language-select`)

    const url = new URL(window.location.href)

    const query    = url.searchParams.get(`q`)
    const language = url.searchParams.get(`language`)

    if (query) this.search.value      = query
    if (language) this.language.value = language

    this.search.focus()

  }

}
