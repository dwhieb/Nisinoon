/* global document */

import Copier from '../../scripts/Copier.js'

// Initialize button to copy citation information

const citationButton = document.querySelector(`[data-hook=copy-citation]`)
const citationEl     = document.querySelector(`[data-hook=citation]`)
const citationCopier = new Copier(citationEl, citationButton)

citationCopier.initialize()

// Initialize button to copy JSON data

const jsonButton = document.querySelector(`[data-hook=copy-json]`)
const jsonEl     = document.querySelector(`[data-hook=json]`)
const jsonCopier = new Copier(jsonEl, jsonButton)

jsonCopier.initialize()
