import debounce from '../utilities/debounce.js'
import delay    from '../utilities/delay.js'

const copyingClass  = `green`
const resetDelay    = 1000

export default class Copier {

  constructor(el, button) {
    this.button = button
    this.el     = el
  }

  async copy() {

    await navigator.clipboard.writeText(this.el.textContent)

    this.button.textContent = `Copied!`
    this.button.classList.add(copyingClass)

    await delay(resetDelay)

    this.reset()

  }

  initialize() {
    this.button.addEventListener(`click`, this.copy.bind(this))
  }

  reset = debounce(() => {
    this.button.textContent = `Copy`
    this.button.classList.remove(copyingClass)
  }, resetDelay, true)

}
