// Retrives the Nisinoon bibliography from the Zotero API as BibTeX data and saves it to `/bibliography/bibliography.bib`.

import { outputFile }  from 'fs-extra'
import parseLinkHeader from 'parse-link-header'
import path            from 'node:path'
import ProgressBar     from 'progress'

const bibtexPath    = path.resolve(import.meta.dirname, `./bibliography.bib`)
const baseURL       = `https://api.zotero.org`
const versionHeader = `Zotero-API-Version`
const apiVersion    = 3
const groupID       = `4815618`
const url           = `${ baseURL }/groups/${ groupID }/items`

let progressBar
let total


async function makeRequest(bibtex = ``, start) {

  const query = new URLSearchParams({
    format: `bibtex`,
    limit:  100,
    start,
  })

  const res = await fetch(`${ url }?${ query }`, {
    headers: {
      [versionHeader]: apiVersion,
    },
  })

  if (res.status !== 200) throw new Error(res.message)

  total ??= Number(res.headers.get(`Total-Results`))

  progressBar ??= new ProgressBar(`:bar`, {
    curr: 100,
    total,
  })

  const data = await res.text()

  bibtex += data

  const linkHeader = res.headers.get(`Link`)
  const { next }   = parseLinkHeader(linkHeader)

  if (next) {
    progressBar.tick(Number(next.start) - start)
    bibtex += await makeRequest(bibtex, next.start)
  }

  return bibtex

}

export default async function getBibliography() {
  const bibtex = await makeRequest()
  await outputFile(bibtexPath, bibtex)
}
