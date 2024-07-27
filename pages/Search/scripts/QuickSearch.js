/* global document, history, localStorage, location */

export default class QuickSearch {

  /**
   * Hook onto DOM elements.
   */
  constructor() {
    this.caseSensitive = document.getElementById(`case-sensitive-box`)
    this.diacritics    = document.getElementById(`diacritics-box`)
    this.form          = document.getElementById(`quick-search-form`)
    this.language      = document.getElementById(`language-select`)
    this.regex         = document.getElementById(`regex-box`)
    this.resetButton   = document.getElementById(`quick-reset-button`)
    this.search        = document.getElementById(`search-box`)
  }

  /**
   * Add event listeners.
   */
  listen() {
    this.caseSensitive.addEventListener(`input`, this.saveSettings.bind(this))
    this.diacritics.addEventListener(`input`, this.saveSettings.bind(this))
    this.form.addEventListener(`input`, this.resetValidity.bind(this))
    this.form.addEventListener(`submit`, this.validate.bind(this))
    this.language.addEventListener(`input`, this.saveSettings.bind(this))
    this.regex.addEventListener(`input`, this.saveSettings.bind(this))
    this.resetButton.addEventListener(`click`, this.reset.bind(this))
  }

  /**
   * Populate the search form.
   * This method combines mixes the functions of a Model and View, but oh well 🤷🏼‍♂️
   * NOTE: Query parameters take precedence over local storage.
   */
  render() {

    const url = new URL(location.href)

    const advanced = url.searchParams.get(`advanced`)

    if (advanced) return

    const caseSensitive = Boolean(url.searchParams.get(`caseSensitive`)) || localStorage.getItem(`caseSensitive`) === `true`
    const diacritics    = Boolean(url.searchParams.get(`diacritics`)) || localStorage.getItem(`diacritics`) === `true`
    const language      = url.searchParams.get(`language`) ?? localStorage.getItem(`language`)
    const query         = url.searchParams.get(`q`)
    const regex         = Boolean(url.searchParams.get(`regex`)) || localStorage.getItem(`regex`) === `true`

    this.caseSensitive.checked = caseSensitive
    this.diacritics.checked    = diacritics
    this.regex.checked         = regex

    if (language) this.language.value = language
    if (query) this.search.value = query

    this.search.focus()

  }

  reset() {

    const url = new URL(location.href)

    // NB: Applying this loop directly to the keys iterator doesn't work,
    // probably because it shifts the index of each key when one is deleted.
    for (const key of Array.from(url.searchParams.keys())) {
      url.searchParams.delete(key)
    }

    // NB: The second parameter to this method is deprecated and does nothing.
    // It's just there because it's required by the method signature.
    history.pushState({}, document.title, url.href)

  }

  resetValidity() {
    this.search.setCustomValidity(``)
  }

  saveSettings() {
    localStorage.setItem(`caseSensitive`, this.caseSensitive.checked)
    localStorage.setItem(`diacritics`, this.diacritics.checked)
    localStorage.setItem(`language`, this.language.value)
    localStorage.setItem(`regex`, this.regex.checked)
  }

  validate(ev) {

    const q = this.search.value

    if (!(q && this.regex.checked)) return

    try {
      new RegExp(q, `v`)
    } catch (e) {
      ev.preventDefault()
      this.search.setCustomValidity(e.message)
      this.search.reportValidity()
    }

  }

}
