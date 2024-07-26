/* global document, window */

const formats = {
  'application/json': `json`,
  'text/csv':         `csv`,
}

export default class Downloader {

  async download(format) {

    const headers = { Accept: format }
    const res     = await fetch(window.location.href, { headers })
    const text    = await res.text()
    const link    = document.createElement(`a`)
    const blob    = new Blob([text], { type: format })

    link.href     = URL.createObjectURL(blob)
    link.download = `results.${ formats[format] }`

    document.body.appendChild(link)
    link.click()
    link.remove()

  }

  initialize() {

    const downloads = document.getElementById(`download-buttons`)

    if (!downloads) return

    const csv  = document.querySelector(`button[name=csv]`)
    const json = document.querySelector(`button[name=json]`)

    csv.addEventListener(`click`, () => this.download(`text/csv`))
    json.addEventListener(`click`, () => this.download(`application/json`))

  }

}
