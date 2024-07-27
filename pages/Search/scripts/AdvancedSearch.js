/* global document, localStorage, location */

export default class AdvancedSearch {

  constructor() {
    this.option = document.getElementById(`advanced-option`)
  }

  render() {

    const url      = new URL(location.href)
    const advanced = url.searchParams.get(`advanced`) || localStorage.getItem(`advanced`) === `true`

    if (!advanced) return

    this.option.checked = true

  }

}
