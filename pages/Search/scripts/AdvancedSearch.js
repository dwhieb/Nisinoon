/* global document, localStorage, location */

export default class AdvancedSearch {

  constructor() {
    this.caseSensitive = document.getElementById(`advanced-case-sensitive-box`)
    this.diacritics    = document.getElementById(`advanced-diacritics-box`)
    this.form          = document.getElementById(`advanced-search-form`)
    this.formBox       = document.getElementById(`form-box`)
    this.language      = document.getElementById(`advanced-language-select`)
    this.regex         = document.getElementById(`advanced-regex-box`)
    this.tagsBox       = document.getElementById(`tags-box`)
  }

  listen() {
    this.caseSensitive.addEventListener(`input`, this.save.bind(this))
    this.diacritics.addEventListener(`input`, this.save.bind(this))
    this.form.addEventListener(`input`, this.resetValidity.bind(this))
    this.form.addEventListener(`submit`, this.validate.bind(this))
    this.language.addEventListener(`input`, this.save.bind(this))
    this.regex.addEventListener(`input`, this.save.bind(this))
  }

  render() {

    const url   = new URL(location.href)
    const query = url.searchParams

    if (query.size && !(query.size === 1 && query.has(`advanced`))) return

    // Restore search settings
    this.caseSensitive.checked = localStorage.getItem(`caseSensitive`) === `true`
    this.diacritics.checked    = localStorage.getItem(`diacritics`) === `true`
    this.language.value        = localStorage.getItem(`language`)
    this.regex.checked         = localStorage.getItem(`regex`) === `true`

  }

  resetValidity() {
    this.formBox.setCustomValidity(``)
    this.tagsBox.setCustomValidity(``)
  }

  save() {
    localStorage.setItem(`caseSensitive`, this.caseSensitive.checked)
    localStorage.setItem(`diacritics`, this.diacritics.checked)
    localStorage.setItem(`language`, this.language.value)
    localStorage.setItem(`regex`, this.regex.checked)
  }

  validate(ev) {

    const fields = document.querySelectorAll(`#advanced-search-form [type=search]`)

    for (const field of fields) {
      try {
        new RegExp(field.value, `v`)
      } catch (e) {
        ev.preventDefault()
        field.setCustomValidity(e.message)
        field.reportValidity()
        return
      }
    }

  }

}
