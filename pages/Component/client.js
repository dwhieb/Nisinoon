/* global document */

import Copier from '../../scripts/Copier.js'

// Initialize button to copy citation information

const button = document.querySelector(`[data-hook=copy-citation]`)
const el     = document.querySelector(`[data-hook=citation]`)
const copier = new Copier(el, button)

copier.initialize()
