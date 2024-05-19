/* global document, window */

function isVisible(el) {
  return el.offsetParent !== null
}

export default class Nav {

  button = document.querySelector(`[data-hook=nav__button]`)

  list = document.querySelector(`[data-hook=nav__links]`)

  hideNav() {
    this.list.classList.add(`visually-hidden`)
  }

  initialize() {
    if (isVisible(this.button)) this.hideNav()
    this.button.addEventListener(`click`, this.toggleNav.bind(this))
    window.addEventListener(`resize`, this.handleResize.bind(this))
  }

  handleResize() {
    if (isVisible(this.button)) this.hideNav()
    else this.showNav()
  }

  showNav() {
    this.list.classList.remove(`visually-hidden`)
  }

  toggleNav() {
    if (this.list.classList.contains(`visually-hidden`)) this.showNav()
    else this.hideNav()
  }

}
