/* global document */

import Copier from '../../scripts/Copier.js'

const button = document.querySelector(`[data-hook=copy-citation]`)
const el     = document.querySelector(`[data-hook=citation]`)

if (button && el) {
  const copier = new Copier(el, button)
  copier.initialize()
}
