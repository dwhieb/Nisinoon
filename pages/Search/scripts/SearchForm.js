/* global document, history, localStorage, location */

export default class SearchForm {

  buttons = {}

  fields = {}

  initialize() {

    this.reset    = document.getElementById(`reset-button`)
    this.language = document.getElementById(`language-select`)
    this.search   = document.getElementById(`search-box`)

    // Populate search form from querystring / local storage.
    // NOTE: Query parameters take precedence over local storage.

    const url      = new URL(location.href)
    const query    = url.searchParams.get(`q`)
    const language = url.searchParams.get(`language`) || localStorage.getItem(`language`)

    if (query) this.search.value      = query
    if (language) this.language.value = language

    this.search.focus()

    // Add event listeners

    this.language.addEventListener(`input`, this.saveLanguage.bind(this))
    this.reset.addEventListener(`click`, this.resetForm.bind(this))

  }

  resetForm() {

    const url = new URL(location.href)

    // NB: Applying this loop directly to the keys iterator doesn't work,
    // probably because it shifts the index of each key when one is deleted.
    for (const key of Array.from(url.searchParams.keys())) {
      url.searchParams.delete(key)
    }

    // NB: The second parameter to this method is deprecated and does nothing.
    history.pushState({}, document.title, url.href)

  }

  saveLanguage(ev) {
    localStorage.setItem(`language`, ev.target.value)
  }

}
