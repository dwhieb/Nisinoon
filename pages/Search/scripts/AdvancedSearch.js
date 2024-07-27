/* global document, localStorage, location */

export default class AdvancedSearch {

  /**
   * Hook onto DOM elements.
   */
  constructor() {
    this.language = document.getElementById(`advanced-language-select`)
  }

  /**
   * Add event listeners.
   */
  listen() {
    this.language.addEventListener(`input`, this.save.bind(this))
  }

  render() {

    const url   = new URL(location.href)
    const query = url.searchParams

    if (query.size && !(query.size === 1 && query.has(`advanced`))) return

    // Restore search settings
    this.language.value = localStorage.getItem(`language`)

  }

  /**
   * Save search settings.
   */
  save() {
    localStorage.setItem(`language`, this.language.value)
  }

}
