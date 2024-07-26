/* global document */

import Copier      from '../../scripts/Copier.js'
import Downloader  from './scripts/Downloader.js'
import QuickSearch from './scripts/QuickSearch.js'
import Table       from './scripts/Table.js'

// Initialize button to copy citation information

const button = document.querySelector(`[data-hook=copy-citation]`)
const el     = document.querySelector(`[data-hook=citation]`)

if (button && el) {
  const copier = new Copier(el, button)
  copier.initialize()
}

// Initialize search box

const quickSearch = new QuickSearch
quickSearch.initialize()

// Initialize results table

const table = new Table
table.initialize()

// Initialize download buttons

const downloader = new Downloader
downloader.initialize()
