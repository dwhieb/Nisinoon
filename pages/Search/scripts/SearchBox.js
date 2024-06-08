/* global document, window */

export default class SearchBox {

  initialize() {

    this.el = document.getElementById(`search-box`)

    const query = new URL(window.location.href).searchParams.get(`q`)

    if (query) {
      this.el.value = query
    }

  }

}
