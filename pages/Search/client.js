/* global document */

import AdvancedSearch from './scripts/AdvancedSearch.js'
import Copier         from '../../scripts/Copier.js'
import Downloader     from './scripts/Downloader.js'
import QuickSearch    from './scripts/QuickSearch.js'
import Table          from './scripts/Table.js'

// Initialize button to copy citation information

const button = document.querySelector(`[data-hook=copy-citation]`)
const el     = document.querySelector(`[data-hook=citation]`)

if (button && el) {
  const copier = new Copier(el, button)
  copier.initialize()
}

// Initialize Quick Search

const quickSearch = new QuickSearch
quickSearch.render()
quickSearch.listen()

// Initialize Advanced Search

const advancedSearch = new AdvancedSearch
advancedSearch.render()

// Initialize results table

const table = new Table
table.initialize()

// Initialize download buttons

const downloader = new Downloader
downloader.initialize()
