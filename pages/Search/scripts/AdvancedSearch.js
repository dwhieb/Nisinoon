/* global document, localStorage, location */

export default class AdvancedSearch {

  /**
   * Hook onto DOM elements.
   */
  constructor() {
    this.caseSensitive = document.getElementById(`advanced-case-sensitive-box`)
    this.diacritics    = document.getElementById(`advanced-diacritics-box`)
    this.language      = document.getElementById(`advanced-language-select`)
  }

  /**
   * Add event listeners.
   */
  listen() {
    this.caseSensitive.addEventListener(`input`, this.save.bind(this))
    this.diacritics.addEventListener(`input`, this.save.bind(this))
    this.language.addEventListener(`input`, this.save.bind(this))
  }

  render() {

    const url   = new URL(location.href)
    const query = url.searchParams

    if (query.size && !(query.size === 1 && query.has(`advanced`))) return

    // Restore search settings
    this.caseSensitive.checked = localStorage.getItem(`caseSensitive`) === `true`
    this.diacritics.checked    = localStorage.getItem(`diacritics`) === `true`
    this.language.value        = localStorage.getItem(`language`)

  }

  /**
   * Save search settings.
   */
  save() {
    localStorage.setItem(`caseSensitive`, this.caseSensitive.checked)
    localStorage.setItem(`diacritics`, this.diacritics.checked)
    localStorage.setItem(`language`, this.language.value)
  }

}
