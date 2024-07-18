/* global document, history, localStorage, location */

export default class SearchForm {

  buttons = {}

  fields = {}

  initialize() {

    this.diacritics = document.getElementById(`diacritics-box`)
    this.reset      = document.getElementById(`reset-button`)
    this.language   = document.getElementById(`language-select`)
    this.search     = document.getElementById(`search-box`)

    // Populate search form from querystring / local storage.
    // NOTE: Query parameters take precedence over local storage.

    const url        = new URL(location.href)
    const diacritics = Boolean(url.searchParams.get(`diacritics`)) || localStorage.getItem(`diacritics`) === `true`
    const language   = url.searchParams.get(`language`) ?? localStorage.getItem(`language`)
    const query      = url.searchParams.get(`q`)

    this.diacritics.checked = diacritics

    if (language) this.language.value = language
    if (query) this.search.value      = query

    this.search.focus()

    // Add event listeners

    this.diacritics.addEventListener(`input`, this.saveSettings.bind(this))
    this.language.addEventListener(`input`, this.saveSettings.bind(this))
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

  saveSettings() {
    localStorage.setItem(`diacritics`, this.diacritics.checked)
    localStorage.setItem(`language`, this.language.value)
  }

}
